import { createSlice } from '@reduxjs/toolkit';
import { act } from 'react';

const initialState = {
    status: false,
    userData: null,
    tempAvatarUrl: null,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers:{
        login: (state, action) => {
            state.status = true;
            state.userData = action.payload.userData;
        },
        logout: (state) =>{
            state.status = false;
            state.userData = null;
        },
        setTempAvatarUrl: (state, action)=> {
            state.tempAvatarUrl = action.payload;
        },
        clearTempAvatarUrl: (state) => {
            state.tempAvatarUrl  = null;
        },
        updateAvatarSuccess: (state, action) => {
            if(state.userData) {
                state.userData.avatar = action.payload;
            }
            state.tempAvatarUrl = null;
        }
    }
});

export const {login, logout, setTempAvatarUrl, clearTempAvatarUrl, updateAvatarSuccess} = authSlice.actions;

export default authSlice.reducer;

