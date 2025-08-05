import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    user: null,
    status: false,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        storeLogin: (state, action) => {
            state.status = true;
            state.user = action.payload.user;
        },
        storeLogout: (state) => {
            state.status = false;
            state.user = null;
        }
    }
})

export const { storeLogin, storeLogout } = userSlice.actions
export default userSlice.reducer