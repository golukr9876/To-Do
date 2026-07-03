import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice'
import todoSlice from './todoSlice';

const store = configureStore({
    reducer: {
        auth: authSlice,
    }
})

export default store;