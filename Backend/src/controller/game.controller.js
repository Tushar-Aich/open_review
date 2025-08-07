import {asyncHandler} from '../utils/asyncHandler.js'
import {APIresponse} from '../utils/APIresponse.js'
import {ApiError} from '../utils/APIerror.js'
import {Game} from '../models/game.model.js'
import {User} from '../models/user.model.js'
import { fetchGamePGN } from '../utils/fetchChess.js'
import {Chess} from 'chess.js'
import { generateMoveReview, generateOverviewReview } from '../utils/gemini.js'
import {spawn} from 'child_process'


function extractPGNdata (pgn) {
    const extract = (tag) => {
        const match = pgn.match(new RegExp(`\\[${tag}\\s+"(.+?)"\\]`))
        return match ? match[1] : null
    }

    return {
        white: extract("White"),
        black: extract("Black"),
        result: extract("Result")
    }
}

function classifyMoves(delta, isBestMove, isSacrifice) {
    // Handle special cases first
    if(isBestMove && isSacrifice && Math.abs(delta) > 1.5) return 'Brilliant';
    if(isBestMove && delta < -2.0) return 'Great'; // Great move that gains significant advantage
    
    // Use absolute value for classification since we care about the magnitude of change
    const absDelta = Math.abs(delta);
    
    if(absDelta <= 0.1) return 'Best';
    if(absDelta > 0.1 && absDelta <= 0.3) {
        return delta > 0 ? 'Excellent' : 'Best'; // Negative delta means improvement
    }
    if(absDelta > 0.3 && absDelta <= 0.6) {
        return delta > 0 ? 'Good' : 'Excellent'; // Negative delta means improvement
    }
    if(absDelta > 0.6 && absDelta <= 1.0) {
        return delta > 0 ? 'Inaccuracy' : 'Good'; // Negative delta means improvement
    }
    if(absDelta > 1.0 && absDelta <= 2.0) {
        return delta > 0 ? 'Mistake' : 'Excellent'; // Negative delta means significant improvement
    }
    if(absDelta > 2.0) {
        return delta > 0 ? 'Blunder' : 'Great'; // Negative delta means great improvement
    }
    
    return 'Unknown';
}

function isPieceSacrifice (chess, move) {
    const fromPiece = chess.get(move.from)
    const toPiece = chess.get(move.to)
    const isMajorPiece = fromPiece && ['n', 'b', 'r', 'q'].includes(fromPiece.type)
    return isMajorPiece && !toPiece
}


async function analyzeWithStockfish (fen) {
    console.log("----------Analyzing game and evaluating moves with stockfish---------")
    return new Promise((resolve, reject) => {
        const engine = spawn('stockfish')
        let evaluation = null
        let topMoves = []
        let bestMove = null
        let isReady = false

        engine.stdout.on('data', (data) => {
            const lines = data.toString().split('\n');
            lines.forEach(line => {
                line = line.trim();
                if (!line) return;

                if(line.includes('uciok') || line.includes('readyok')) {
                    if(!isReady) {
                        isReady = true
                        engine.stdin.write('setoption name MultiPV value 3\n')
                        engine.stdin.write(`position fen ${fen}\n`)
                        engine.stdin.write('go depth 12\n')
                    }
                }
                if(line.startsWith('info') && line.includes('score')) {
                    const scoreMatch = line.match(/score (cp|mate) (-?\d+)/)
                    const moveMatch = line.match(/pv (\w+)/)
                    const multipvMatch = line.match(/multipv (\d+)/)
                    if(scoreMatch && moveMatch && multipvMatch) {
                        const scoreType = scoreMatch[1]
                        const scoreValue = parseInt(scoreMatch[2], 10)
                        const move = moveMatch[1]
                        const rank = parseInt(multipvMatch[1], 10)

                        // Convert mate scores to numerical values for calculations
                        let moveEval;
                        if (scoreType === 'cp') {
                            moveEval = scoreValue / 100; // Convert centipawns to pawns
                        } else {
                            // For mate scores, use very high/low values to represent advantage
                            // Positive mate = advantage for current side, negative = disadvantage
                            moveEval = scoreValue > 0 ? 50 - scoreValue : -50 - scoreValue;
                        }

                        if (rank === 1) {
                            evaluation = moveEval
                        }
                        
                        // Store both numerical value and display format
                        topMoves.push({ 
                            move, 
                            eval: moveEval, 
                            displayEval: scoreType === 'cp' ? moveEval : (scoreValue > 0 ? `M${scoreValue}` : `M${Math.abs(scoreValue)}`),
                            rank 
                        });
                    }
                }
                if(line.startsWith('bestmove')) {
                    bestMove = line.split(' ')[1]
                    engine.stdin.end()
                    topMoves.sort((a, b) => a.rank - b.rank);
                    resolve({ eval: evaluation, topMoves, bestMove })
                }
            });
        })
        engine.stderr.on('data', (data) => {
            console.error(`Stockfish error: ${data.toString()}`)
        })
        engine.on('error', (err) => {
            reject(err)
        })
        engine.stdin.write('uci\n')
        engine.stdin.write('isready\n')
    })
}

const analyzeGame = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const {uuid} = req.query

    if(!uuid) {
        console.error("UUID not found")
        return res.status(404).json(new ApiError(404, "UUID not found"))
    }

    const existingUser = await User.findById(userId)
    if(!existingUser) {
        console.error("User not found")
        return res.status(404).json(new ApiError(404, "User not found"))
    }

    const existingGame = await Game.findOne({uuid: uuid})
    if(existingGame) return res.status(200).json(new APIresponse(200, existingGame, "Game fetched successfully"));

    const pgn = await fetchGamePGN(existingUser.username, uuid)
    console.log("PGN: ", pgn)

    console.log("----------Initializing chess.js and loading pgn---------")

    const chess = new Chess()
    chess.loadPgn(pgn)
    console.log("----------PGN loaded---------")

    const moves = chess.history({verbose: true})
    chess.reset()

    const {white, black, result} = extractPGNdata(pgn)
    const isUserWhite = existingUser.username.toLowerCase() === white.toLowerCase()

    const overview = {
        Brilliant: 0,
        Great: 0,
        Best: 0,
        Excellent: 0,
        Good: 0,
        Inaccuracy: 0,
        Mistake: 0,
        Blunder: 0,
        Unknown: 0
    }

    const moveDetails = []

    for(let i = 0; i < moves.length; i++) {
        const move = moves[i]
        const isWhiteMove = i % 2 === 0 // Even indices are white moves, odd are black
        const isUserMove = (isUserWhite && isWhiteMove) || (!isUserWhite && !isWhiteMove)

        console.log(`Analyzing move ${i + 1}: ${move.san} (${isUserMove ? 'USER' : 'OPPONENT'})`)

        const fenBefore = chess.fen()
        
        const {topMoves, eval: evalBefore} = await analyzeWithStockfish(fenBefore)

        chess.move(move)
        const uciMove = chess.history({verbose: true}).slice(-1)[0]
        const playedUci = uciMove.from + uciMove.to + (uciMove.promotion || "")

        const fenAfter = chess.fen()
        const { eval: evalAfter } = await analyzeWithStockfish(fenAfter)

        const delta = (chess.turn === 'w') ? evalBefore - evalAfter : evalAfter - evalBefore

        let label = null
        if(isUserMove) {
            const isSacrifice = isPieceSacrifice(chess, uciMove)
            const isBestMove = topMoves.length && playedUci === topMoves[0].move

            label = classifyMoves(delta, isBestMove, isSacrifice)
            overview[label]++
        }

        moveDetails.push({
            moveNumber: Math.ceil((i + 1) / 2), 
            move: move.san,
            fen: chess.fen(),
            eval: typeof evalAfter === 'string' ? evalAfter : evalAfter,
            evalDiff: delta,
            type: label, 
            comment: ""
        })
    }
    const comments = await generateMoveReview(moveDetails, white, existingUser.username)

    console.log("overview: ", overview)

    for(let i = 0; i < moveDetails.length; i++) {
        moveDetails[i].comment = comments[i].comment || ""
    }

    const gameReview = await generateOverviewReview(overview, pgn)

    const newGame = await Game.create({
        uuid: uuid,
        username: existingUser.username,
        white,
        black,
        result,
        pgn,
        overview: {
            Brilliant: overview.Brilliant,
            Great: overview.Great,
            Best: overview.Best,
            Excellent: overview.Excellent,
            Good: overview.Good,
            Inaccuracy: overview.Inaccuracy,
            Mistake: overview.Mistake,
            Blunder: overview.Blunder
        },
        finalReview: gameReview,
        moveComments: moveDetails,
        fenlist: chess.history({verbose: true}).map(move => move.from + move.to + (move.promotion || ""))
    })

    const savedGame = await Game.findById(newGame._id)
    if(!savedGame) {
        console.error("Error saving game analysis")
        return res.status(500).json(new ApiError(500, "Error saving game analysis"))
    }
    return res.status(200).json(new APIresponse(200, savedGame, "Game analysis completed successfully"))
})

export {
    analyzeGame
}