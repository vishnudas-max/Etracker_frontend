import {configureStore} from '@reduxjs/toolkit'
import userSlice from './UserAuthSlice'
import expensereducer from './expensesSlice'
const  store = configureStore({
    reducer: {
        user: userSlice,
        expenses:expensereducer
    },
});

export default store;