import { Quantity } from "../../component/index";
import { useEffect, useState } from "react";
import { getDetailProduct } from "../../api/Product";
import "./QuickView.css";

const QuickView = ({ pid }) => {
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // lấy sản phẩm
  useEffect(() => {
    const FetchProductDetail = async () => {
      const data = await getDetailProduct(pid);
      if (data.success) {
        setProduct(data.productData);
      }
    };
    FetchProductDetail();
  }, [pid]);

  // Kiểm tra loại thuộc tính phân loại
  const hasSize = product?.variants?.some(v => v.size);
  const hasColor = product?.variants?.some(v => v.color);

  // Gom variant theo size (nếu có)
  const groupedVariants = hasSize
    ? product?.variants?.reduce((acc, variant) => {
      if (!acc[variant.size]) acc[variant.size] = [];
      acc[variant.size].push(variant);
      return acc;
    }, {}) || {}
    : { default: product?.variants || [] };

  // Khi có product thì set mặc định variant đầu tiên
  useEffect(() => {
    if (product?.variants?.length > 0) {
      if (hasSize) {
        const firstSize = product.variants[0].size;
        setSelectedSize(firstSize);
        setSelectedVariant(product.variants[0]);
      } else {
        setSelectedSize("default");
        setSelectedVariant(product.variants[0]);
      }
    }
  }, [product, hasSize]);

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    setSelectedVariant(groupedVariants[size][0]); // chọn variant đầu trong size đó
  };

  const handleColorChange = (variant) => {
    setSelectedVariant(variant);
  };

  const handleCart = () => {
    const cartItem = {
      productId: product._id,
      name: product.title,
      size: selectedVariant?.size || product.size || "",
      color: selectedVariant?.color || product.color || "",
      price: selectedVariant?.price || product.price,
      quantity: quantity,
      image: selectedVariant?.image || product.image || "",
    };
    console.log("🛒 Cart item:", cartItem);
  };

  return (
    <div>
      <div className="row product-row">
        {/* ẢNH SẢN PHẨM */}
        <div className="col-lg-4 col-md-6 col-12 d-flex align-items-center justify-content-center">
          <img
            src={selectedVariant?.image || product?.image}
            alt={selectedVariant?.color || selectedVariant?.size}
            className="img-fluid"
            style={{ maxHeight: "500px", objectFit: "contain" }}
          />
        </div>

        {/* THÔNG TIN SẢN PHẨM */}
        <div className="col-lg-4 col-md-6 col-12 px-3">
          <p className="h5 fw-bold">{product?.title}</p>
          <h4 className="text-danger">
            {selectedVariant
              ? selectedVariant.price.toLocaleString("vi-VN")
              : product?.price?.toLocaleString("vi-VN")}{" "}
            đ
          </h4>

          {selectedVariant && (
            <ul className="list-unstyled mb-3">
              {hasColor && (
                <li>
                  <strong>Màu sắc:</strong> {selectedVariant.color}
                </li>
              )}
              {hasSize && (
                <li>
                  <strong>Kích cỡ:</strong> {selectedVariant.size}
                </li>
              )}
            </ul>
          )}

          {/* SIZE OPTION (nếu có) */}
          {hasSize && (
            <div className="d-flex flex-wrap gap-2 mb-3">
              {Object.keys(groupedVariants).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeChange(size)}
                  className={`btn btn-outline-primary btn-sm ${size === selectedSize ? "active" : ""
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          )}

          {/* COLOR OPTION (nếu có) */}
          <div className="row g-2">
            {groupedVariants[selectedSize]?.map((variant) => (
              <div className="col-4" key={variant._id}>
                <div
                  role="button"
                  onClick={() => handleColorChange(variant)}
                  className={`border rounded text-center p-2 h-100 ${selectedVariant?._id === variant._id ? "border-primary" : ""
                    }`}
                >
                  <img
                    src={variant.image}
                    alt={variant.color || variant.size}
                    className="img-fluid mb-1"
                  />
                  <div className="small">
                    {variant.color || variant.size || "Default"}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3">Đã bán: {product?.sold}</div>

          <div className="my-3">
            <Quantity quantity={quantity} setQuantity={setQuantity} />
          </div>

          <button
            type="button"
            className="btn btn-danger w-100"
            onClick={handleCart}
          >
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickView;
