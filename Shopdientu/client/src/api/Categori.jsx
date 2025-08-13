import axios from "../ultils/axios"

export const getCategoriProduct = async () => {
    const data = await axios.get("/productcategory/getAllProductCategoryvs");
    return data;
}

export const getProductCategoryTitle = async (title) => {

    const data = await axios.get("/productcategory/getProductCategoryTitle", { params: title });
    return data;
}