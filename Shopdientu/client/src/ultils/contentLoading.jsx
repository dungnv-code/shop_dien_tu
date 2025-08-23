import React, { createContext, useState, useEffect } from "react";
import { loadingController } from "./loadingController";

export const LoadingContext = createContext({ loading: false, loadingText: "Đang xử lý..." });

export const LoadingProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("Đang xử lý...");

    useEffect(() => {
        loadingController.register(setLoading, setLoadingText);
        return () => loadingController.unregister();
    }, []);

    return (
        <LoadingContext.Provider value={{ loading, loadingText }}>
            {children}
        </LoadingContext.Provider>
    );
};
