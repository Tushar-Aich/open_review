import axios from 'axios'

export const loginUser = async (username) => {
    try {
        const res = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/users/login`,
            {username},
            {
                headers: { "Content-Type": 'application/json' },
                withCredentials: true
            }
        )
        if(res.data.statusCode > 200) {
            throw new Error(res.data.message || 'Login failed')
        }
        return res
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'An error occurred'
        throw new Error(message)
    }
}

export const getStats = async () => {
    try {
        const res = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/users/stats`,
            {
                headers: { "Content-Type": 'application/json' },
                withCredentials: true
            }
        )
        if(res.data.statusCode > 200) {
            throw new Error(res.data.message || 'Stats fetching unsuccessful')
        }
        return res
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'An error occurred'
        throw new Error(message)
    }
}