import { createSlice } from '@reduxjs/toolkit';
// import * as action from "./asyncActionUser";

export const UsertSlice = createSlice({
    name: 'user',
    initialState: {
        isLogIn: false,
        current: null,
        token: false,
    },

    reducers: {
        resgister: (state, action) => {
            state.isLogIn = action.payload.isLogIn;
            state.current = action.payload.current;
            state.token = action.payload.token;
        }
    },
    // extraReducers: (builder) => {
    //     builder.addCase(action.getCategoris.fulfilled, (state, action) => {
    //         state.isLoading = false;
    //         state.categoris = action.payload.data;
    //     })
    //     builder.addCase(action.getCategoris.rejected, (state, action) => {
    //         state.isLoading = false;
    //         state.errorMessage = action.payload.message;
    //     })
    // }
})

export const { resgister } = UsertSlice.actions;

export default UsertSlice.reducer;