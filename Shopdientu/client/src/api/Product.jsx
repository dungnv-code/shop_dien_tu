import axios from "../ultils/axios"

export const getProducts = async ({ params = {} } = {}) => {
    const response = await axios.get("/product/getAllProducts", { params });
    return response;
}