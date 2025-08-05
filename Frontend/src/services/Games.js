import axios from 'axios'

export const monthlyGames = async (username) => {
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = String(currentDate.getMonth() + 1).padStart(2, '0')
    try {
        const res = await axios.get(
            `${import.meta.env.VITE_CHESS_DOT_COM_URI}/player/${username}/games/${year}/${month}`
        )
        if(res.status !== 200) {
            throw new Error(res.data.message || 'Login failed')
        }
        return res.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'An error occurred'
        throw new Error(message)
    }
}


export const fetchGameData = async (uuid) => {
    try {
        const res = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/games/analyze?uuid=${uuid}`,
            {
                headers: { "Content-Type": 'application/json' },
                withCredentials: true
            }
        )
        if(res.status !== 200) {
            throw new Error(res.data.message || 'Login failed')
        }
        return res.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'An error occurred'
        throw new Error(message)
    }
}