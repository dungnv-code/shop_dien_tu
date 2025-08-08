import { createAsyncThunk } from "@reduxjs/toolkit";
import { getCategoriProduct } from "../../api/Categori";

export const getCategoris = createAsyncThunk(
    "app/categoris",
    async (data, { rejectWithValue }) => {
        try {
            const response = await getCategoriProduct();
            if (response?.mes !== "Success") {
                return rejectWithValue(response.data);
            }
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
