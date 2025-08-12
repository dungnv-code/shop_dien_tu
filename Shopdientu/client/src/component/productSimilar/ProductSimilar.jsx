import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { getProducts } from "../../api/Product";
import Products from "../product/product"
import "./ProductSimilar.css"
const ProductSimilar = ({ category }) => {
    var settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
    };

    const [products, setProducts] = useState([]);

    useEffect(() => {
        const FetchProduct = async () => {
            console.log(category)
            const seed = Number(new Date().toISOString().split("T")[0].replace(/-/g, ''));
            const response = await getProducts({
                params: { category, random: true, seed, limit: 7 }
            });
            setProducts(response.productDatas)
        }
        FetchProduct();
    }, []);

    useEffect(() => {

    }, [products])

    return <>
        <div >
            <div className="" style={{ margin: "20px 0" }}>
                <h3 style={{ fontWeight: "bold" }}>Sản phẩm tương tự</h3>
            </div>
            <div className="row-custom">
                <Slider {...settings}>
                    {products.map((item, index) => (
                        <div key={index} className="m-1 product-card" >
                            <div >
                                <Products dataProduct={item} />
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </div >
    </>
}

export default ProductSimilar;