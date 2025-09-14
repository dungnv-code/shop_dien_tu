import WithBaseComponent from '../../../HOC/withBaseComponent'
import { useSelector, useDispatch } from "react-redux";
import { Quantity } from "../../../component/index";
import { UpdateQuantityCart, RemoveCart } from "../../../api/User";
import useDebounce from "../../../ultils/useDebone";
import { useState, useEffect } from "react";
import { path } from "../../../ultils/path";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';
import "./Mycart.css"
import { getCurrent } from '../../../redux/userSlice/asyncActionUser';
const Mycart = (pops) => {

    const { current } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [refresh, setRefresh] = useState(false)
    // clone cart từ redux thành localCart
    const [localCart, setLocalCart] = useState([]);

    useEffect(() => {
        if (current?.cart) {
            setLocalCart(current.cart);
        }
    }, [current?.cart, refresh]);

    // debounce localCart để gọi API
    const debouncedCart = useDebounce(localCart, 1000);

    // update server khi localCart thay đổi
    useEffect(() => {
        const updateServer = async () => {
            try {
                const promises = debouncedCart.map((item) =>
                    UpdateQuantityCart(item._id, { quantity: item.quantity })
                );
                await Promise.all(promises);
                // dispatch(getCurrent());
            } catch (err) {
                console.error("Lỗi update cart:", err);
            }
        };

        if (debouncedCart.length > 0) {
            updateServer();
        }
    }, [debouncedCart]);

    // thay đổi số lượng trong localCart
    const handleQuantityChange = (id, updater) => {
        setLocalCart((prev) =>
            prev.map((item) =>
                item._id === id
                    ? {
                        ...item,
                        quantity:
                            typeof updater === "function"
                                ? updater(item.quantity)
                                : updater,
                    }
                    : item
            )
        );
    };

    const hanleThanhtoan = (e) => {
        e.preventDefault()
        console.log(localCart)
    }

    const hanleRemoveCart = async (id) => {
        const reponsive = await RemoveCart(id)
        if (reponsive?.success) {
            Swal.fire({
                icon: "success",
                title: "Xoá sản phẩm thành công",
                showConfirmButton: false,
                timer: 2000,
            });
            dispatch(getCurrent())
        }
    }

    return (
        <div className="mycart-container container py-3">
            <h3 className="fw-bold mb-3">🛒 Giỏ hàng của tôi</h3>

            {localCart.length > 0 ? (
                <>
                    <div className="cart-items">
                        {localCart.map((item) => (
                            <div key={item._id} className="cart-item card shadow-sm mb-3 p-3">
                                <div className="row align-items-center">
                                    {/* Hình + thông tin */}
                                    <div className="col-md-6 d-flex">
                                        <img
                                            src={item?.image}
                                            className="cart-item-img me-3"
                                            alt={item?.name}
                                        />
                                        <div>
                                            <h6 className="mb-1">{item?.name}</h6>
                                            <div className="text-muted small">
                                                {item?.color} | {item?.size}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Số lượng */}
                                    <div className="col-md-3 text-center">
                                        <Quantity
                                            quantity={item.quantity}
                                            setQuantity={(updater) =>
                                                handleQuantityChange(item._id, updater)
                                            }
                                        />
                                    </div>

                                    {/* Giá */}
                                    <div className="col-md-3 text-end">
                                        <b className="text-danger">
                                            {(item?.price * item.quantity).toLocaleString("vi-VN")} đ
                                        </b>
                                        <div>
                                            <button type="button" className='btn btn-primary' onClick={() => { hanleRemoveCart(item._id) }} >Xoá</button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Tổng tiền */}
                    <div className="cart-total text-end mt-3">
                        <h5>
                            Tổng tiền:{" "}
                            <span className="text-danger fw-bold">
                                {localCart
                                    ?.reduce((sum, el) => sum + el.price * el.quantity, 0)
                                    .toLocaleString("vi-VN")}{" "}
                                đ
                            </span>
                        </h5>
                    </div>

                    {/* Nút đặt hàng */}
                    <div className="d-flex justify-content-end mt-3">
                        <Link to={`/${path.CHECKOUT}`} className="btn btn-primary px-4 fw-bold">
                            Đặt hàng
                        </Link>
                    </div>
                </>
            ) : (
                <div className="alert alert-info mt-3">
                    Giỏ hàng của bạn đang trống 😢
                </div>
            )}
        </div>
    );
}

export default WithBaseComponent(Mycart);