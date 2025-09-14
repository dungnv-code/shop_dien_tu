import axios from "../ultils/axios"; // chính là 'instance' đã export ở trên

export const getOrderUser = async ({ params }) => {
    const response = await axios.get("/order/getAllOrder", { params });
    return response;
};

export const updateStatusOrderUser = async (id, data) => {
    const response = await axios.put(`/order/updateOrderStatus/${id}`, data);
    return response;
};