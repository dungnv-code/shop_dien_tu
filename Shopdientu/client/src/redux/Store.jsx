import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./Slice/productsSlice";
import userReducer from "./userSlice/userSlice"
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist"
const CommonConfig = {
    key: "shop/user",
    storage
}

const UserConfig = {
    ...CommonConfig,
    whitelist: ["isLogIn", "token"],
}

export const store = configureStore({
    reducer: {
        "app": productReducer,
        "user": persistReducer(UserConfig, userReducer),
    }
})

export const perStore = persistStore(store);