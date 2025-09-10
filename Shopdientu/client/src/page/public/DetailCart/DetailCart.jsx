import { useSelector, useDispatch } from "react-redux";
import { Quantity } from "../../../component/index";
import { UpdateQuantityCart } from "../../../api/User";
import useDebounce from "../../../ultils/useDebone";
import { useState, useEffect } from "react";
import { path } from "../../../ultils/path";
import { Link } from "react-router-dom";
const DetailCart = () => {
    const { current } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    // clone cart từ redux thành localCart
    const [localCart, setLocalCart] = useState([]);

    useEffect(() => {
        if (current?.cart) {
            setLocalCart(current.cart);
        }
    }, [current?.cart]);

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

    return (
        <div>
            <h3>Giỏ hàng của tôi</h3>
            <div className="row text-center border border-1 p-2">
                <div className="col-4">
                    <b>Sản phẩm</b>
                </div>
                <div className="col-4">
                    <b>Số lượng</b>
                </div>
                <div className="col-4">
                    <b>Giá</b>
                </div>
            </div>

            <div className="border border-1 p-2 mt-3">
                {localCart.map((item) => (
                    <div key={item._id} className="row text-center">
                        <div className="col-4 text-start d-flex">
                            <div className="p-2">
                                <img src={item?.image} width={"100px"} alt={item?.name} />
                            </div>
                            <div>
                                <div>{item?.name}</div>
                                <div>{item?.color}</div>
                                <div>{item?.size}</div>
                            </div>
                        </div>

                        <div className="col-4 d-flex justify-content-center">
                            <div>
                                <Quantity
                                    quantity={item.quantity}
                                    setQuantity={(updater) =>
                                        handleQuantityChange(item._id, updater)
                                    }
                                />
                            </div>
                        </div>
                        <div className="col-4">
                            <b>
                                {(item?.price * item.quantity).toLocaleString("vi-VN")} vnđ
                            </b>
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-1 text-end">
                <b>
                    Tổng tiền {localCart?.reduce(
                        (sum, el) => sum + el.price * el.quantity,
                        0
                    ).toLocaleString("vi-VN")} vnđ
                </b>
            </div>
            <div className="d-flex justify-content-end p-1">
                <button type="button" className="btn btn-primary"  ><Link to={`/${path.CHECKOUT}`}>Đặt hàng</Link></button>
            </div>
        </div>
    );
};

export default DetailCart;
