import axios from "../ultils/axios"; // chính là 'instance' đã export ở trên

export const getOrderUser = async ({ params }) => {
    const response = await axios.get("/order/getAllOrder", { params });
    return response;
};