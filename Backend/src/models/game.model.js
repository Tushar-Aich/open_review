import mongoose from 'mongoose'

const moveCommentSchema = new mongoose.Schema({
    moveNumber: Number,
    move: String,
    fen: String,
    eval: Number,
    evalDiff: Number,
    type: String,
    comment: String
}, {_id: false})

const overviewSchema = new mongoose.Schema({
    Brilliant: Number,
    Great: Number,
    Best: Number,
    Excellent: Number,
    Good: Number,
    Inaccuracy: Number,
    Mistake: Number,
    Blunder: Number
}, {_id: false})

const gameAnalysisSchema = new mongoose.Schema({
    uuid: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    white: String,
    black: String,
    result: String,
    pgn: String,
    overview: overviewSchema,
    finalReview: String,
    moveComments: [moveCommentSchema],
    fenlist: [String],
}, {timestamps: true})

export const Game = mongoose.model("Game", gameAnalysisSchema)