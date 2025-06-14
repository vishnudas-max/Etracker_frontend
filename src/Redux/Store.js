import {configureStore} from '@reduxjs/toolkit'
import userSlice from './UserAuthSlice'

const  store = configureStore({
    reducer: {
        user: userSlice,
    },
});

export default store;