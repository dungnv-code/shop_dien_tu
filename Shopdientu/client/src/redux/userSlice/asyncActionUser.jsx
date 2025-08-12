import { createAsyncThunk } from "@reduxjs/toolkit";
import { getCurrentUser } from "../../api/User";

export const getCurrent = createAsyncThunk(
    "app/getCurrent",
    async (data, { rejectWithValue }) => {
        try {
            const response = await getCurrentUser();
            if (response?.success == "fasle") {
                return rejectWithValue(response.rs);
            }
            return response.rs;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
