import {GoogleGenAI} from '@google/genai'
import { ApiError } from './APIerror.js'
import dotenv from 'dotenv'
dotenv.config()

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_KEY})

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const generateMoveReview = async (moveDetails, white, username) => {
    const comments = []

    for(let i = 0; i < moveDetails.length; i++) {
        if(username.toLowerCase() === white.toLowerCase()) {
            if(i % 2 === 0) {
                const prompt = `
                    You're a chess grandmaster and a well knowledged person in chess. Please take the moves and analyze them deeply, providing insightful comments for each move. Just provide a one-liner comment around 10-20 words and noting else. just make a comment on the move and nothing else. Don't return moves or fen or evaluation or anything just comment on the move. Strictly just return a text of 10-20 words which will be your comment and nothing else.

                    Move: ${moveDetails[i].move}
                    FEN: ${moveDetails[i].fen}
                    Evaluation: ${moveDetails[i].eval}

                    Example: 
                        Input:
                            Move: e4
                            FEN: rnbqkb1r/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
                            Evaluation: 0.00
                        
                        Output: 
                            "This is a solid opening move, controlling the center and allowing for quick development of pieces."  
                    Now just like this analyze the move and give a comment:
                `

                try {
                    const response = await ai.models.generateContent({
                        model: 'gemini-2.0-flash-lite',
                        config: {
                            thinkingConfig: {
                                thinkingBudget: 0
                            },
                            systemInstruction: prompt,
                            temperature: 1.0
                        },
                        contents: [{parts: [{text: `Please look at the system prompt correctly and all the examples at the system prompt and tell give a sarcastic yet educational comment: move: ${moveDetails[i].move}, fen: ${moveDetails[i].fen}, eval: ${moveDetails[i].eval}`}]}]
                    })
                    if (!response.text) {
                        throw new Error("No response text received from Gemini AI")
                    }
                    console.log(response.text, "\n\n")
                    comments.push({
                        comment: response.text
                    })
                } catch (error) {
                    console.error(`Error for move: ${move.move}`, error.message)
                    throw new ApiError(400, "Error generating overview")
                } finally {
                    await delay(2300)
                }
            } else {
                comments.push({
                    comment: ""
                })
            }
        } else {
            if(i % 2 === 1) {
                const prompt = `
                    You're a chess grandmaster and a well knowledged person in chess. Please take the moves and analyze them deeply, providing insightful comments for each move. Just provide a one-liner comment around 10-20 words and noting else. just make a comment on the move and nothing else. Don't return moves or fen or evaluation or anything just comment on the move. Strictly just return a text of 10-20 words which will be your comment and nothing else.

                    Move: ${moveDetails[i].move}
                    FEN: ${moveDetails[i].fen}
                    Evaluation: ${moveDetails[i].eval}

                    Example: 
                        Input:
                            Move: e4
                            FEN: rnbqkb1r/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
                            Evaluation: 0.00
                        
                        Output: 
                            "This is a solid opening move, controlling the center and allowing for quick development of pieces."  
                    Now just like this analyze the move and give a comment:
                `

                try {
                    const response = await ai.models.generateContent({
                        model: 'gemini-2.0-flash-lite',
                        config: {
                            thinkingConfig: {
                                thinkingBudget: 0
                            },
                            systemInstruction: prompt,
                            temperature: 1.0
                        },
                        contents: [{parts: [{text: `Please look at the system prompt correctly and all the examples at the system prompt and tell give a educational comment: move: ${moveDetails[i].move}, fen: ${moveDetails[i].fen}, eval: ${moveDetails[i].eval}`}]}]
                    })
                    if (!response.text) {
                        throw new Error("No response text received from Gemini AI")
                    }
                    console.log(response.text, "\n\n")
                    comments.push({
                        comment: response.text
                    })
                } catch (error) {
                    console.error(`Error for move: ${move.move}`, error.message)
                    throw new ApiError(400, "Error generating overview")
                } finally {
                    await delay(2300)
                }
            } else {
                comments.push({
                    comment: ""
                })
            }
        }
    }

    return comments
}

export const generateOverviewReview = async (overview, pgn) => {
    const prompt = `
        You're a great grandmaster in chess and a helpful coach.

        Analyze this PGN and the move label summary below. Write a **short paragraph** that:
        - Is sarcastic but educational
        - Mentions what the player did well
        - Points out their weaknesses (like too many blunders, missed tactics)
        - Suggests 1-2 improvements
        - Includes a bit of humor or roasting — but still helpful

        Don't write multiple paragraphs or explanations. Keep it brief, max 3-5 sentences. Avoid emojis or markdown.

        PGN:
        ${pgn}

        Move labels:
        overview: {
            Brilliant: ${overview.Brilliant},
            Great: ${overview.Great},
            Best: ${overview.Best},
            Excellent: ${overview.Excellent},
            Good: ${overview.Good},
            Inaccuracy: ${overview.Inaccuracy},
            Mistake: ${overview.Mistake},
            Blunder: ${overview.Blunder},
            Unknown: ${overview.Unknown}
        }

        Example:
            pgn = '[Event "Online"]
                    1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. b4 Bxb4 5. c3 Bc5 6. d4 exd4 7. cxd4 Bb4+ 8. Kf1 d6 9. Ng5 Nh6 10. Qh5 O-O';
            overview = {
                Brilliant: 1,
                Great: 0,
                Best: 3,
                Excellent: 2,
                Good: 2,
                Inaccuracy: 2,
                Mistake: 2,
                Blunder: 3,
                Unknown: 0,
            }
            Response: "You entered the Four Knights Game, a solid and classical opening. Both sides developed symmetrically, but resigning after just 3...Nc6 suggests an early mistake or misclick. Next time, try continuing with 4. Bb5 or 4. d4 to challenge the center. Always stay calm-even if something goes wrong, fighting on can lead to valuable learning moments!."
        
        Now its your turn to analyze the game and write a short paragraph:
    `

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash-lite',
            config: {
                thinkingConfig: {
                    thinkingBudget: 0
                },
                systemInstruction: prompt,
                temperature: 1.0
            },
            contents: [{parts: [{text: `Please look at the system prompt correctly and all the examples at the system prompt and tell give a educational comment: pgn: ${pgn}, overview: ${JSON.stringify(overview)}`}]}]
        })
        console.log(response.text, "\n\n")
        if (!response.text) {
            throw new Error("No response text received from Gemini AI")
        }
        return response.text
    } catch (error) {
        console.error(`Error for move: ${move.move}`, error.message)
        throw new ApiError(400, "Error generating overview")
    } finally {
        await delay(2300)
    }
}