import axios from 'axios'

export const fetchChessDotComUser = async (username) => {
    try {
        const response = await axios.get(
            `${process.env.CHESS_DOT_COM_URI}/player/${username}`,
            {
                withCredentials: true,
                headers: {
                    "Accept": "application/json"
                }
            }
        )
        return response.data
    } catch (error) {
        console.error(error.message || "Something went wrong")
        return null
    }
}

export const fetchGamePGN = async (username, uuid) => {
    console.log("----------Fetching games---------")
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = String(currentDate.getMonth() + 1).padStart(2, '0')
    try {
        const res = await axios.get(
            `${process.env.CHESS_DOT_COM_URI}/player/${username}/games/${year}/${month}`,
            {
                withCredentials: true,
                headers: {
                    "Accept": "application/json"
                }
            }
        )
        const games = res.data.games
        const requiredGame = games.find(g => g.uuid === uuid)
        if(!requiredGame) {
            console.error("Game not found")
            return null
        }
        return requiredGame.pgn
    } catch (error) {
        console.error(error.message || "Something went wrong")
        return null
    }
}