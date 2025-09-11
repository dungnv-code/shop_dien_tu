import { useSelector, useDispatch } from "react-redux";
import { getCurrent } from "../../../redux/userSlice/asyncActionUser";
import { PayPal } from "../../../component";
import "./checkout.css";
import { useState, useEffect, useRef } from "react";
import Confiti from "../confiti/Confiti";

const CheckOut = () => {
    const { current } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const [address, setAddress] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const containerRef = useRef(null);

    // 🔹 Load user khi mở trang
    useEffect(() => {
        dispatch(getCurrent());
    }, [dispatch, isSuccess]);

    // 🔹 Set địa chỉ mặc định
    useEffect(() => {
        if (current?.address) {
            setAddress(current.address || "");
        }
    }, [current]);

    // 🔹 Tính tổng tiền
    const total =
        current?.cart?.reduce((sum, el) => sum + el.price * el.quantity, 0) || 0;

    return (
        <div
            ref={containerRef}
            className="checkout-container"
            style={{
                position: "relative",
                overflow: "visible",
                minHeight: 400,
            }}
        >
            {/* Hiệu ứng confetti khi thành công */}
            {isSuccess && <Confiti parentRef={containerRef} />}

            {/* Ảnh minh họa */}
            <div className="checkout-image">
                <img
                    src="/images.png"
                    alt="Sản phẩm"
                    className="product-preview"
                />
            </div>

            {/* Cột chi tiết đơn hàng */}
            <div className="checkout-details">
                <h2 className="section-title">🛒 Đơn hàng của bạn</h2>
                <table className="table table-striped table-hover shadow-sm rounded">
                    <thead className="table-dark">
                        <tr>
                            <th scope="col">STT</th>
                            <th scope="col">Tên sản phẩm</th>
                            <th scope="col">Số lượng</th>
                            <th scope="col">Giá</th>
                        </tr>
                    </thead>
                    <tbody>
                        {current?.cart?.map((item, index) => (
                            <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>{item.name}</td>
                                <td>{item.quantity}</td>
                                <td>
                                    {(
                                        item.quantity * item.price
                                    ).toLocaleString("vi-VN")}{" "}
                                    ₫
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="checkout-total">
                    <b>Tổng: {total.toLocaleString("vi-VN")} ₫</b>
                </div>

                <h3 className="section-title">📦 Thông tin giao hàng</h3>
                <div className="p-4 space-y-4">
                    {/* Input địa chỉ */}
                    <input
                        type="text"
                        className="form-control mb-3"
                        placeholder="Nhập địa chỉ giao hàng"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />

                    <div className="mt-4">
                        <strong>Địa chỉ đã nhập:</strong>{" "}
                        {address || "Chưa nhập"}
                    </div>
                </div>

                {/* PayPal */}
                {address.length > 0 && (
                    <div className="paypal-wrapper w-100 d-flex justify-content-center">
                        <PayPal
                            payload={{
                                products: current?.cart,
                                total: Number((total / 25000).toFixed(2)),
                                orderBy: current?._id,
                                address: address,
                            }}
                            setIsSuccess={setIsSuccess}
                            amount={Number((total / 25000).toFixed(2))}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckOut;
