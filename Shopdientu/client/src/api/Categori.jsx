import axios from "../ultils/axios"

export const getCategoriProduct = async () => {
    const data = await axios.get("/productcategory/getAllProductCategoryvs");
    return data.data;
}