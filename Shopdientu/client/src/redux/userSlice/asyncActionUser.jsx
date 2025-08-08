import { createAsyncThunk } from "@reduxjs/toolkit";
import { LoginUser } from "../../api/User";

export const getCategoris = createAsyncThunk(
    "app/categoris",
    async (data, { rejectWithValue }) => {
        try {
            const response = await LoginUser();
            if (response?.mes !== "Success") {
                return rejectWithValue(response.data);
            }
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
