import axios from "../ultils/axios"; // chính là 'instance' đã export ở trên

export const LoginUser = async (data) => {
    // Vì interceptor trả về response.data, kết quả ở đây chính là data
    const response = await axios.post("/user/logIn", data, { withCredentials: true });
    return response; // response là data
}

export const RegisterUser = async (data) => {
    const response = await axios.post("/user/register", data);
    return response; // response là data
}
