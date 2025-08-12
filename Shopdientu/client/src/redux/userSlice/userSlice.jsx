import { createSlice } from '@reduxjs/toolkit';
import * as action from "./asyncActionUser";

export const UsertSlice = createSlice({
    name: 'user',
    initialState: {
        isLogIn: false,
        current: null,
        token: false,
    },

    reducers: {
        LogIn: (state, action) => {
            state.isLogIn = action.payload.isLogIn;
            state.token = action.payload.token;
        },
        LogOut: (state, action) => {
            state.isLogIn = false;
            state.token = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(action.getCurrent.pending, (state, action) => {
            state.isLoading = true;
        })
        builder.addCase(action.getCurrent.fulfilled, (state, action) => {
            state.isLoading = false;
            state.current = action.payload;
        })
        builder.addCase(action.getCurrent.rejected, (state, action) => {
            state.isLoading = false;
            state.current = null;
        })
    }
})

export const { LogIn, LogOut } = UsertSlice.actions;

export default UsertSlice.reducer;