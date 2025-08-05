import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./Slice/userSlice";

const store = configureStore({
    reducer: {
        "app": userReducer,
    }
})

export default store;