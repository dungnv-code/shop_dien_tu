import axios from "../ultils/axios"; // chính là 'instance' đã export ở trên

export const LoginUser = async (data) => {
    const response = await axios.post("/user/logIn", data, { withCredentials: true });
    return response;
}

export const RegisterUser = async (data) => {
    const response = await axios.post("/user/register", data);
    return response;
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

export const getCurrentUser = async () => {
    const response = await axios.get("/user/getSingleUser");
    return response;
}

export const LogoutUser = async () => {
    const response = await axios.post("/user/logOut", {}, { withCredentials: true });
    return response;
}

export const GetAllUsers = async (data) => {
    const response = await axios.get("/user/getAllUsers", { params: data });
    return response;
}

export const UpdateUsers = async (data, uid) => {
    const response = await axios.put(`/user/updateUserbyAdmin/${uid}`, data);
    return response;
}

export const DeleteUsers = async (uid) => {
    const response = await axios.delete(`/user/deleteUser?_id=${uid}`);
    return response;
}

export const UpdatebyUsers = async (data) => {
    const response = await axios.put(`/user/updateUser`, data);
    return response;
}

export const AddCartUser = async (data) => {
    const response = await axios.post(`user/updateCart`, data);
    return response;
}

export const RemoveCart = async (id) => {
    const response = await axios.delete(`user/removeCart/${id}`);
    return response;
}

export const UpdateQuantityCart = async (id, data) => {
    const response = await axios.post(`user/updateCartQuantity/${id}`, data);
    return response;
}

export const UpdateWishList = async (id) => {
    const response = await axios.put(`user/updateWishList/${id}`);
    return response;
}