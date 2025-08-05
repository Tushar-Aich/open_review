import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import dotenv from 'dotenv'
dotenv.config()

const app = express()

const client_url = process.env.CORS_ORIGIN
console.log(client_url)

app.use(
    cors({
        origin: client_url,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
        optionsSuccessStatus: 204,
        maxAge: 86400
    })
);

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser())

app.options('/api/v1/games/analyze', (req, res) => {
    res.sendStatus(204);
})


//router import
import userRouter from './routes/user.route.js';
import gameRouter from './routes/game.route.js'


//routes declaration
app.use("/api/v1/users", userRouter)
app.use('/api/v1/games', gameRouter)

export default app;