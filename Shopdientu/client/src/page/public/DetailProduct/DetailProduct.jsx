import "./DetailProduct.css"
import { useParams } from "react-router-dom";
import { getDetailProduct } from "../../../api/Product";
import { useEffect, useState } from "react";
import { Breadcrumbs } from "../../../component";
import { ProductSimilar, Quantity, DescriptionProduct } from "../../../component/index"
import { AddCartUser } from "../../../api/User";
import Swal from "sweetalert2";
import { getCurrent } from "../../../redux/userSlice/asyncActionUser";
import { useDispatch } from "react-redux";
const DetailProduct = () => {
    const { pid, title } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const dispatch = useDispatch()
    // lấy sản phẩm
    useEffect(() => {
        const FetchProductDetail = async () => {
            const data = await getDetailProduct(pid);
            if (data.success) {
                setProduct(data.productData)
            }
        }
        FetchProductDetail();
    }, [pid]);

    // gom variants theo size
    const groupedVariants = product?.variants?.reduce((acc, variant) => {
        if (!acc[variant.size]) acc[variant.size] = [];
        acc[variant.size].push(variant);
        return acc;
    }, {}) || {};

    // khi có product thì set mặc định variant đầu tiên
    useEffect(() => {
        if (product?.variants?.length > 0) {
            const firstSize = product.variants[0].size;
            setSelectedSize(firstSize);
            setSelectedVariant(product.variants[0]);
        }
    }, [product]);

    const handleSizeChange = (size) => {
        setSelectedSize(size);
        setSelectedVariant(groupedVariants[size][0]); // chọn màu đầu trong size đó
    };

    const handleColorChange = (variant) => {
        setSelectedVariant(variant);
    };

    const handleCart = () => {
        const cartItem = {
            product: product._id,
            name: product.title,
            size: selectedVariant?.size || product.size || "",
            color: selectedVariant?.color || product.color || "",
            price: selectedVariant?.price || product.price,
            quantity: quantity,
            image: selectedVariant?.image || product.image || "",
        };

        const featchAddcartProduct = async () => {

            try {
                const reponsive = await AddCartUser(cartItem);
                Swal.fire({
                    title: 'Thêm vào giỏ hàng thành công',
                    icon: 'success',
                    timer: 1000, // 2 giây
                    showConfirmButton: false // ẩn nút OK
                })
                await dispatch(getCurrent())
            } catch (err) {
                console.log(err)
                Swal.fire({
                    title: err?.mes || 'Đã có lỗi sảy ra',
                    icon: 'error',
                    timer: 1000, // 2 giây
                    showConfirmButton: false // ẩn nút OK
                })
            }
        }
        featchAddcartProduct()
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
                <div style={{ width: "100%", height: 400 }}>
                    <img
                        src={selectedVariant?.image || product?.image}
                        alt={selectedVariant?.color}
                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                </div>
            </div>

            {/* THÔNG TIN SẢN PHẨM */}
            <div className="col-lg-4 col-md-6 col-12" style={{ margin: "0 10px" }}>
                <p className="product-title">{product?.title}</p>
                <h4 className="product-price">
                    {selectedVariant
                        ? selectedVariant.price.toLocaleString("vi-VN")
                        : product?.price?.toLocaleString("vi-VN")} đ
                </h4>
                {selectedVariant && (
                    <>
                        <p><b>Màu sắc:</b> {selectedVariant.color}</p>
                        <p><b>Dung lượng ổ cứng:</b> {selectedVariant.size}</p>
                    </>
                )}

                {/* SIZE OPTION */}
                <div className="d-flex gap-2 flex-wrap mb-2">
                    {Object.keys(groupedVariants).map((size) => (
                        <div
                            key={size}
                            onClick={() => handleSizeChange(size)}
                            className={`border px-3 py-1 rounded ${size === selectedSize ? "bg-light" : ""}`}
                        >
                            {size}
                        </div>
                    ))}
                </div>

                {/* DANH SÁCH MÀU */}
                <div className="row gap-1">
                    {groupedVariants[selectedSize]?.map((variant) => (
                        <div className="col-4" key={variant._id}>
                            <div
                                className={`item-box ${selectedVariant?._id === variant._id ? "active" : ""}`}
                                onClick={() => handleColorChange(variant)}
                            >
                                <img src={variant.image} alt={variant.color} />
                                <div>{variant.color}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="m-1">Đã bán: {product?.sold}</div>

                <div>
                    <Quantity quantity={quantity} setQuantity={setQuantity} />
                </div>
                <button type="button" className="btn btn-danger mt-3" onClick={handleCart}>
                    Thêm vào giỏ hàng
                </button>
            </div>

            {/* BOX KHUYẾN MÃI */}
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

        {/* MÔ TẢ SẢN PHẨM */}
        <div className="row" style={{ margin: "30px 0" }}>
            <div className="col-9 ">
                {product && (
                    <DescriptionProduct
                        name={product?.title}
                        pid={product._id}
                        description={product?.description}
                        totalrating={product?.totalRating}
                        rating={product?.ratings}
                    />
                )}
            </div>
            <div className="col-3">Blog</div>
        </div>

        {/* SẢN PHẨM TƯƠNG TỰ */}
        {product?.category && <ProductSimilar category={product.category} />}
    </div>
}

export default DetailProduct;
