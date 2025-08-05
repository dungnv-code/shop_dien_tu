import axios from "axios";

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_SERVER,
});

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token"); // hoặc lấy từ cookies
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(function (response) {
    return response.data;
}, function (error) {
    return error.data;
});

export default instance;