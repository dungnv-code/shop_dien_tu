import axios from "axios";
import Swal from "sweetalert2";
// import { loadingController } from "./loadingController";

const instance = axios.create({ baseURL: import.meta.env.VITE_API_SERVER });

instance.interceptors.request.use((config) => {

    let localStoData = window.localStorage.getItem("persist:shop/user");
    if (typeof localStoData === 'string') {
        try {
            const parsedData = JSON.parse(localStoData); // parse object persist
            const accessToken = parsedData.token ? JSON.parse(parsedData.token) : null; // parse token string
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
        } catch (e) {
            console.error("Lỗi parse token từ localStorage:", e);
        }
    }
    // loadingController.setLoading(true);
    // loadingController.setLoadingText(config.loadingText || "Đang xử lý...");
    return config;
});

instance.interceptors.response.use(
    (response) => {

        // loadingController.setLoading(false);
        return response.data;
    },
    (error) => {
        // console.log("axios error -> setLoading false");
        // loadingController.setLoading(false);

        const errData = error.response?.data || { mes: "Lỗi kết nối server" };
        const status = error.response?.status;

        Swal.fire({
            icon: "error",
            title: status ? `Lỗi ${status}` : "Lỗi kết nối",
            text: errData.mes || "Đã xảy ra lỗi",
            confirmButtonText: "OK",
        });

        return Promise.reject(errData);
    }
);

export default instance;
