import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const statsSchema = new mongoose.Schema({
    rating: { type: Number, default: 0 },
    game: { type: Number, default: 0 },
    win: { type: Number, default: 0 },
    loss: { type: Number, default: 0 },
    draw: { type: Number, default: 0 },
    best: {  type: Number, default: 0 },
}, { _id: false })

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        avatar: {
            type: String
        },
        playerid: {
            type: String,
            required: true,
            unique: true
        },
        country: {
            type: String
        },
        isVerified: {
            type: Boolean
        },
        league: {
            type: String
        },
        stats: {
            blitz: statsSchema,
            rapid: statsSchema,
            bullet: statsSchema,
        },
        token: {
            type: String
        }
    }
)

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this.id,
            email: this.email,
            username: this.userName,
            fullName: this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this.id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    )
}

export const User = mongoose.model("User", userSchema)