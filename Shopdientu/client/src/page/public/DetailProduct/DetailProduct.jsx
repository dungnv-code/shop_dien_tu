import "./DetailProduct.css"
import { useParams } from "react-router-dom";
import { getDetailProduct } from "../../../api/Product";
import { useEffect, useState, useRef } from "react";
import { Breadcrumbs } from "../../../component";
import Slider from "react-slick";
import { ProductSimilar, Quantity, DescriptionProduct } from "../../../component/index"

const DetailProduct = () => {

    const { pid, title } = useParams();
    const sliderRef = useRef(null);
    const [product, setProduct] = useState(null);
    const [indexVariant, setIndexVariant] = useState(0);
    const [indexVarIn, setIndexIn] = useState(0);
    const [quantity, setQuantity] = useState(1)

    useEffect(() => {
        const FetchProductDetail = async () => {
            const data = await getDetailProduct(pid);
            if (data.success) {
                setProduct(data.productData)
            }
        }
        FetchProductDetail();
    }, [product?.ratings])

    const goToSlide = (index) => {
        sliderRef.current.slickGoTo(index);
        setIndexIn(index);
    };

    const hanleGb = (index) => {
        setIndexVariant(index);
        setIndexIn(0);
    }

    const hanleCart = () => {
        console.log(product?.variants?.[indexVariant]?.color?.[indexVarIn]);
        console.log("quantify", quantity)
    }

    const images = product?.variants?.[indexVariant]?.image || [];
    const variantsst = product?.variants;

    var settings = {
        customPaging: function (i) {
            return (
                <img
                    src={images[i]}
                    alt={`thumb-${i}`}
                    style={{
                        width: 60,
                        height: 60,
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        cursor: "pointer",
                        transform: "translateY(-30%)",
                    }}
                />
            );
        },
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    return <div style={{ padding: "10px 25px" }}>
        <div>
            <h3>{product?.title}</h3>
        </div>
        <div className="m-2" style={{ borderBottom: "1px solid gray" }}>
            <Breadcrumbs title={title} categori={product?.category} />
        </div>
        <div className="row product-row">
            <div className="col-lg-4 col-md-6 col-12 product-image">
                {product?.variants?.length === 0 ? (
                    <div style={{ width: "100%", height: 400 }}>
                        <img
                            src={product.image}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                            }}
                        />
                    </div>
                ) : (
                    <Slider ref={sliderRef} {...settings}>
                        {product?.variants?.[indexVariant]?.image?.map((item, idx) => (
                            <div key={idx} style={{ width: "100%", height: 400 }}>
                                <img
                                    src={item}
                                    alt=""
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "contain",
                                    }}
                                />
                            </div>
                        ))}
                    </Slider>
                )}
            </div>

            <div className="col-lg-4 col-md-6 col-12" style={{ margin: "0 10px" }}>
                <p className="product-title">{product?.title}</p>
                <h4 className="product-price">
                    {product?.variants?.length !== 0 ? product?.variants[indexVariant]?.price[indexVarIn].toLocaleString("vi-VN") : <>{product?.price.toLocaleString("vi-VN")}</>} đ
                </h4>
                <p>
                    {product?.variants?.length !== 0 && (<> <b>màu sắc:</b> {product?.variants[indexVariant]?.color[indexVarIn]}</>)}
                </p>
                <div className="row gap-1">
                    {product?.variants[indexVariant]?.color.map((item, index) => (
                        <div className="col-4" key={index}>
                            <div className="item-box" onClick={() => { goToSlide(index) }}>
                                <img src={images[index]} alt="al" />
                                <div>{item}</div>
                            </div>
                        </div>
                    ))}
                </div>
                {
                    product?.variants?.length !== 0 && (<><p><b>Dung lượng ổ cứng:</b> {variantsst?.[indexVariant]?.size} gb</p></>)
                }
                <div className="d-flex gap-2 flex-wrap">
                    {product?.variants.map((variant, index) => (
                        <div key={variant._id || index} onClick={() => { hanleGb(index) }} className="border px-3 py-1 rounded">
                            {variant.size} gb
                        </div>
                    ))}
                </div>
                <div className="m-1">
                    Đã bán: {product?.sold}
                </div>
                <div>
                    <Quantity quantity={quantity} setQuantity={setQuantity} />
                </div>
                <button type="button" className="btn btn-danger mt-3" onClick={() => { hanleCart() }}>Thêm vào giỏ hàng</button>
            </div>

            <div className="col-lg-3 col-md-6 col-12 promo-box">
                <div className="promo-title">KHUYẾN MÃI</div>
                <ul>
                    <li>Giảm 100.000đ cho các bạn sinh viên học sinh</li>
                    <li>Tặng củ sạc kèm dây sạc chính hãng</li>
                    <li>Tặng ốp chống sốc</li>
                    <li>Tặng cường lực chống bám vân tay</li>
                </ul>
            </div>
        </div>
        <div className="row" style={{ margin: "30px 0" }}>
            <div className="col-9 ">
                {product && <DescriptionProduct name={product?.title} pid={product._id} description={product?.description} totalrating={product?.totalRating} rating={product?.ratings} />}
            </div>
            <div className="col-3">
                Blog
            </div>
        </div>
        {product?.category && <ProductSimilar category={product.category} />}
    </ div >
}

export default DetailProduct;