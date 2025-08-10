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

export const finalRegisterUser = async (token) => {
    const response = await axios.put(`/user/finalRegister/${token}`);
    return response;
}

export const ForgotPasswordUser = async (data) => {
    const response = await axios.post("/user/forgotPassword", data);
    return response;
}

export const ResetPasswordUser = async (data) => {
    const response = await axios.put("/user/resetPassword", data);
    return response;
}
