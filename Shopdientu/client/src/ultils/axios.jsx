import axios from "axios";
import Swal from "sweetalert2";

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_SERVER,
    // timeout: 10000, // tùy ý
});

// request interceptor (giữ nguyên)
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// IMPORTANT: gắn response interceptor vào 'instance', không phải global axios
instance.interceptors.response.use(
    (response) => {
        // Thành công → trả về data trực tiếp
        return response.data;
    },
    (error) => {
        // Nếu không có response (ví dụ mất mạng), xử lý fallback
        const errData = error.response?.data || { mes: "Lỗi kết nối server" };
        const status = error.response?.status;

        // Hiển thị thông báo lỗi
        Swal.fire({
            icon: "error",
            title: status ? `Lỗi ${status}` : "Lỗi kết nối",
            text: errData.mes || "Đã xảy ra lỗi",
            confirmButtonText: "OK",
        });

        // Reject để bên ngoài có thể catch
        return Promise.reject(errData);
    }
);

export default instance;
