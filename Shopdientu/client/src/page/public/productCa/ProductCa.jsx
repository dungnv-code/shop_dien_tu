import "./ProductCa.css"
import { useParams } from "react-router-dom";
import { Breadcrumbs, Product, FilterPro } from "../../../component";
import { getProducts } from "../../../api/Product";
import { useEffect, useState, useCallback } from "react";
import { getProductCategoryTitle } from "../../../api/Categori";
import Masonry from 'react-masonry-css'
const breakpointColumnsObj = {
    default: 5,
    1100: 3,
    700: 2,
    500: 1
};

const ProductCa = () => {
    const { category } = useParams();
    const [products, setProducts] = useState([]);
    const [actives, setActives] = useState(null);
    const [brand, setBrand] = useState([]);
    useEffect(() => {
        const fetchProducts = async () => {
            const response = await getProducts({
                params: { category, limit: 100 }
            });

            const brand = await getProductCategoryTitle({ "title": category });

            if (Array.isArray(brand.reponse) && brand.reponse.length > 0) {
                const brands = brand.reponse[0].brand;
                setBrand(brands);
            }

            setProducts(response?.productDatas);
        }
        fetchProducts();
    }, [category])

    useEffect(() => {

    }, [products])

    const changeActive = useCallback((name) => {
        if (actives === name) {
            setActives(null);
        } else {
            setActives(name);
        }
    }, [actives])

    return <>
        <div style={{ padding: "20px 30px" }}>
            <h4>{category}</h4>
            <div className="m-2" style={{ borderBottom: "1px solid gray" }}>
                <Breadcrumbs categori={category} />
            </div>
            <div className="row" style={{ border: "1px solid gray" }}>
                <div className="col-9 m-2">
                    <div className="m-2"><b>Lọc theo</b></div>
                    <div className="d-flex gap-5">
                        <FilterPro name="Giá" actives={actives} type="input" changeActive={changeActive} />
                        <FilterPro name="Thương hiệu" actives={actives} data={brand} changeActive={changeActive} />
                    </div>
                </div>
                <div className="col-2 m-2">
                    <div className="m-2"><b>Sắp xếp theo</b></div>
                </div>
            </div>
            <div style={{ padding: "20px 10px" }}>
                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid_column"
                >
                    {products?.map((item, index) => {
                        return <div key={index}>
                            <Product dataProduct={item} />
                        </div>
                    })}
                </Masonry>
            </div>
        </div>
    </>
}

export default ProductCa;