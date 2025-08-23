import axios from "../ultils/axios"

export const getCategoriProduct = async () => {
    const data = await axios.get("productcategory/getAllProductCategory");
    return data;
}

export const getProductCategoryTitle = async (title) => {
    const data = await axios.get("/productcategory/getProductCategoryTitle", { params: title });
    return data;
}