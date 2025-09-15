import axios from "../ultils/axios"

export const getAllBlog = async ({ param }) => {
    const data = await axios.get("blog/getAllBlog", { params: param });
    return data;
}

export const getBlogCategorisAll = async () => {
    const data = await axios.get("blogcategoris/getAllBlogCategori");
    return data;
}

export const CreateBlogCategoris = async (data) => {
    const repon = await axios.post("blog/createBlog", data);
    return repon;
}

export const UpdateBlogUser = async (id, data) => {
    const repon = await axios.put(`blog/updateBlog/${id}`, data);
    return repon;
}

export const DeleteBlogUser = async (id) => {
    const repon = await axios.delete(`blog/deleteBlog/${id}`);
    return repon;
}

export const UpdateStatusBlog = async (id, data) => {
    const repon = await axios.put(`blog/updateStatusBlog/${id}`, data);
    return repon;
}

export const getDetailBlog = async (id) => {
    const repon = await axios.get(`blog/getDetailBlog/${id}`);
    return repon;
}

export const likeBlog = async (id) => {
    const repon = await axios.post(`blog/likeBlog/${id}`);
    return repon;
}

export const dislikeBlog = async (id) => {
    const repon = await axios.post(`blog/dislikeBlog/${id}`);
    return repon;
}





