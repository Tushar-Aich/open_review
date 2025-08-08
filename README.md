# Open Review

Analyze your Chess.com games with Stockfish and AI-generated commentary. This monorepo contains a Node.js/Express backend and a Vite + React frontend.

## Features
- Sign in with Chess.com username (no OAuth)
- Dashboard with live stats (blitz/rapid/bullet)
- Fetch monthly games from Chess.com
- Per-move analysis via Stockfish
- AI commentary and short final review (Google Gemini)
- Secure cookie-based auth (JWT)

## Tech Stack
- Backend: Node.js, Express 5, Mongoose, JWT, chess.js, Stockfish, node-cron, @google/genai
- Frontend: React (Vite), React Router, Redux Toolkit + Persist, react-chessboard, Tailwind CSS

## Project Structure
```
Backend/
|--src/
|--|--app.js
|--|--index.js
|--|--cron.js
|--|--config/
|--|--controller/
|--|--middleware/
|--|--models/
|--|--routes/
|--|--utils/
|--package.json
Frontend/
|--src/
|--|--App.jsx
|--|--main.jsx
|--|--Pages/
|--|--components/
|--|--services/
|--|--store/
|--package.json
|--vite.config.js
```

## Prerequisites
- Node.js >= 18
- MongoDB connection string
- Stockfish engine available on PATH (binary name: `stockfish`)
- Google Gemini API key (for @google/genai)

## Environment Variables
Create the following files.

Backend (`Backend/.env`):
```
PORT=8000
MONGODB_URI=mongodb+srv://...
CORS_ORIGIN=http://localhost:5173
CHESS_DOT_COM_URI=https://api.chess.com/pub

# JWT
ACCESS_TOKEN_SECRET=your_access_secret
ACCESS_TOKEN_EXPIRY=7d
REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRY=15d

# Google Gemini
GEMINI_KEY=your_gemini_api_key
```

Frontend (`Frontend/.env`):
```
VITE_BACKEND_URL=http://localhost:8000/api/v1
VITE_CHESS_DOT_COM_URI=https://api.chess.com/pub
```

Notes:
- Cookies are set as `httpOnly`, `Secure`, `SameSite=None`. Use HTTPS in development (or change cookie flags for local-only use).
- CORS must include your frontend origin.

## Install & Run (Development)
In two terminals:

Backend
```
cd Backend
npm install
npm run dev
```

Frontend
```
cd Frontend
npm install
npm run dev
```
- Frontend: http://localhost:5173
- Backend: http://localhost:8000

Optional cron worker (updates user stats on a schedule):
```
cd Backend
npm run start:cron
```

## API Overview
Base URL: `/api/v1`

- Auth
  - POST `/users/login`
    - body: `{ "username": "<chess.com_username>" }`
    - sets cookies: `accessToken`, `refreshToken`
  - GET `/users/stats` (requires auth cookie)

- Games
  - GET `/games/analyze?uuid=<game_uuid>` (requires auth cookie)
    - analyzes game, saves and returns review + per-move comments

Minimal examples (curl):
```
# Login
curl -i -X POST http://localhost:8000/api/v1/users/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"erik"}'

# After login, reuse cookies printed by curl (-c/-b) to call:
curl -i 'http://localhost:8000/api/v1/games/analyze?uuid=<uuid>' -b cookies.txt -c cookies.txt
```

## How It Works
- Backend fetches monthly games and PGNs from Chess.com
- Stockfish evaluates each position; labels moves (Best, Inaccuracy, Blunder, etc.)
- Google Gemini creates short comments per move and a final overview
- Results are stored in MongoDB and returned to the frontend

## Troubleshooting
- Stockfish not found: ensure `stockfish` is installed and on PATH
- Cookies not set in dev: use HTTPS or adjust cookie flags and CORS origin
- 401 Unauthorized: ensure cookies are sent with requests (`withCredentials: true`)

## License
ISC

## Acknowledgements
- Chess.com Public API
- Stockfish Engine
- Google Gemini (@google/genai)
