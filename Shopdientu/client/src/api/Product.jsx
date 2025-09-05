import axios from "../ultils/axios"

export const getProducts = async ({ params = {} } = {}) => {
    const response = await axios.get("/product/getAllProducts", { params });
    return response;
}

export const getDetailProduct = async (id) => {
    const response = await axios.get(`/product/getDetailProduct/${id}`);
    return response;
}

export const createProducts = async (data) => {
    const response = await axios.post(`/product/createProduct/`, data);
    return response;
}

export const UpdateProducts = async (data, id) => {
    const response = await axios.put(`/product/updateProduct/${id}`, data);
    return response;
}

export const DeleteProducts = async (id) => {
    const response = await axios.delete(`/product/deleteProduct/${id}`);
    return response;
}

export const getVariant = async (id) => {
    const response = await axios.get(`/product/getVariantItem/${id}`);
    return response;
}

export const addVariant = async (data) => {
    const response = await axios.post(`/product/addVariantItem`, data);
    return response;
}

export const deleteVariant = async (data) => {
    const response = await axios.delete(`/product/deleteVariant`, { data }); // Thay đổi: đặt `data` vào trong object `{ data: data }`
    return response;
}


export const Ratings = async (data) => {
    const response = await axios.put(`/product/ratings`, data);
    return response;
}