import { createSlice } from '@reduxjs/toolkit';
import * as action from "./asyncActionUser";

export const UserSlice = createSlice({
    name: 'app',
    initialState: {
        categoris: null,
        isLoading: false,
    },

    reducers: {

    },

    extraReducers: (builder) => {
        builder.addCase(action.getCategoris.fulfilled, (state, action) => {
            state.isLoading = false;
            state.categoris = action.payload.data;
        })
        builder.addCase(action.getCategoris.rejected, (state, action) => {
            state.isLoading = false;
            state.errorMessage = action.payload.message;
        })
    }

})

export const { updateUser, resetUser } = UserSlice.actions;

export default UserSlice.reducer;