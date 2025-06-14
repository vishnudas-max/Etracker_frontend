import { createSlice } from '@reduxjs/toolkit';

const authUserSlice = createSlice({
    name: 'user',
    initialState: {
        is_auth: false,
        username: '',
        user_id: '',
        is_admin:false
    },
    reducers: {
        login: (state, action) => {
            state.is_auth = action.payload.is_auth;
            state.username = action.payload.username;
            state.user_id = action.payload.user_id;
            state.is_admin = action.payload.is_admin
        },
        logout: (state) => {
            state.is_auth = false;
            state.username = '';
            state.user_id = '';
            state.is_admin = false
        }
    }
});

export const { login, logout } = authUserSlice.actions;
export default authUserSlice.reducer;
