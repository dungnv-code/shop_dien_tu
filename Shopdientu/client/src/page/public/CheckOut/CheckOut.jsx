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
    const [showPayPal, setShowPayPal] = useState(false);
    const [useAdvancedValidation, setUseAdvancedValidation] = useState(false);

    const containerRef = useRef(null);

    // 🔹 Load user khi mở trang
    useEffect(() => {
        dispatch(getCurrent());
    }, [dispatch, isSuccess]);

    // 🔹 Set địa chỉ mặc định từ user
    useEffect(() => {
        if (current?.address) {
            setAddress(current.address || "");
        }
    }, [current]);

    // 🔹 Tính tổng tiền
    const total =
        current?.cart?.reduce((sum, el) => sum + el.price * el.quantity, 0) || 0;

    // =========================
    // 🔹 Validate địa chỉ
    // =========================
    const handleValidateAndPay = async () => {
        setShowPayPal(false);

        if (!address.trim()) {
            alert("❌ Vui lòng nhập địa chỉ giao hàng");
            return;
        }

        if (useAdvancedValidation) {
            try {
                const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
                    address
                )}&format=json&countrycodes=vn&limit=1`;

                const res = await fetch(url, {
                    headers: { "Accept-Language": "vi" }, // dùng header này thay vì User-Agent
                });
                const data = await res.json();

                if (data.length > 0) {
                    const verified = data[0].display_name;
                    setAddress(verified);
                    setShowPayPal(true);
                } else {
                    alert("❌ Địa chỉ không hợp lệ, vui lòng nhập lại");
                }
            } catch (err) {
                console.error("Lỗi xác thực địa chỉ:", err);
                alert("⚠️ Không thể xác thực địa chỉ, thử lại sau");
            }
        } else {
            setShowPayPal(true);
        }
    };


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
            {isSuccess && <Confiti parentRef={containerRef} />}

            {/* Cột chi tiết đơn hàng */}
            <div className="checkout-details">
                <h2 className="section-title">🛒 Đơn hàng của bạn</h2>
                <table className="table table-striped table-hover shadow-sm rounded">
                    <thead className="table-dark">
                        <tr>
                            <th>STT</th>
                            <th>Tên sản phẩm</th>
                            <th>Số lượng</th>
                            <th>Giá</th>
                        </tr>
                    </thead>
                    <tbody>
                        {current?.cart?.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.name}</td>
                                <td>{item.quantity}</td>
                                <td>
                                    {(item.quantity * item.price).toLocaleString(
                                        "vi-VN"
                                    )}{" "}
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
                    <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Nhập địa chỉ giao hàng"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />

                    {/* Tuỳ chọn xác thực nâng cao */}
                    <div className="form-check mb-3">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={useAdvancedValidation}
                            onChange={(e) =>
                                setUseAdvancedValidation(e.target.checked)
                            }
                            id="advancedCheck"
                        />
                        <label
                            className="form-check-label"
                            htmlFor="advancedCheck"
                        >
                            Sử dụng xác thực nâng cao (OpenStreetMap)
                        </label>
                    </div>

                    <button
                        className="btn btn-primary"
                        onClick={handleValidateAndPay}
                    >
                        Xác nhận & Thanh toán
                    </button>
                </div>

                {/* Hiển thị PayPal khi địa chỉ đã xác thực */}
                {showPayPal && (
                    <div className="paypal-wrapper w-100 d-flex justify-content-center mt-3">
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
