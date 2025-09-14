import styles from "./product.module.css"
import { IoMdStar, IoMdMenu } from "react-icons/io";
import { FaEye, FaHeart, FaCartPlus } from "react-icons/fa";
import { BsFillCartCheckFill } from "react-icons/bs";
import { memo } from "react";
import clsx from "clsx"
import { createSearchParams, Link } from "react-router-dom";
import { path } from "../../ultils/path";
import { toSlug } from "../../ultils/helper";
import WithBaseComponent from "../../HOC/withBaseComponent";
import { QuickView } from "../index"
import { useState, useEffect, useRef } from "react";
import { AddCartUser, UpdateWishList } from "../../api/User";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { getCurrent } from "../../redux/userSlice/asyncActionUser";
const Product = ({ dataProduct, navigate, dispatch }) => {
    const price = dataProduct.price.toLocaleString();
    const { current } = useSelector((state) => state.user)
    const modalRef = useRef(null);
    const hanleClickWishList = async (e) => {
        e.preventDefault()
        try {
            const respon = await UpdateWishList(dataProduct?._id);
            if (respon?.success) {
                await dispatch(getCurrent())   // cập nhật Redux
                Swal.fire({
                    title: respon?.mes || 'Cập nhật danh sách yêu thích thành công',
                    icon: 'success',
                    timer: 1000,
                    showConfirmButton: false
                })
            }
        } catch (err) {
            Swal.fire({
                title: err?.mes || 'Đã có lỗi xảy ra',
                icon: 'error',
            })
        }
    }

    const hanleQuickView = (e) => {
        e.preventDefault()
        const modal = new window.bootstrap.Modal(modalRef.current);
        modal.show();
    }

    const hanleAddtoCart = () => {
        const cartItem = {
            product: dataProduct._id,
            name: dataProduct.title,
            size: dataProduct.size || "",
            color: dataProduct.color || "",
            price: dataProduct.price,
            quantity: 1,
            image: dataProduct.image || "",
        };

        const featchAddcartProduct = async () => {
            try {
                const reponsive = await AddCartUser(cartItem);
                await dispatch(getCurrent())
                Swal.fire({
                    title: 'Thêm vào giỏ hàng thành công',
                    icon: 'success',
                    timer: 1000, // 2 giây
                    showConfirmButton: false // ẩn nút OK
                })
            } catch (err) {
                Swal.fire({
                    title: err?.mes || 'Đã có lỗi xảy ra',
                    icon: 'error',
                    showCancelButton: true, // hiện thêm 1 nút
                    confirmButtonText: 'Đăng nhập', // text của nút chính
                    cancelButtonText: 'Đóng',       // nút phụ
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate({
                            pathname: `${path.LOGIN}`,
                            search: createSearchParams({ redict: location.pathname }).toString()
                        })
                    }
                });
            }
        }
        featchAddcartProduct()
    }

    return <>
        <>
            <div className="modal" ref={modalRef} tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-body">
                            <QuickView pid={dataProduct._id} />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ width: "100%", position: "relative", fontSize: "14px" }} className={clsx(styles.border_shadow, "h-100", "p-3")}>
                <div className="p-1" style={{ position: "relative" }}>
                    {
                        dataProduct.image ? <Link to={`/${toSlug(dataProduct?.category)}/${dataProduct._id}/${dataProduct.slug}`}> <img src={dataProduct?.image} style={{ objectFit: "contain" }} width={"100%"} height={"163px"} alt="amh"></img></Link>
                            : <Link to={`/${toSlug(dataProduct?.category)}/${dataProduct?._id}/${dataProduct?.slug}`}><img src="https://i.pinimg.com/736x/fb/c4/87/fbc487b4b3a80a130c52dcb5c1bd7bee.jpg" style={{ objectFit: "contain" }} width={"100%"} height={"163px"} alt="amh"></img></Link>
                    }
                    <div
                        className={clsx(styles.hover_icon)}
                        style={{
                            width: "100%",
                            position: "absolute",
                            display: "flex",
                            gap: 10,
                            justifyContent: "center",
                        }}
                    >
                        <div
                            onClick={(e) => hanleClickWishList(e)}
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title="Thêm vào yêu thích"
                        >
                            {
                                current?.wishlist?.some((item) => item._id.toString() === dataProduct._id) ? (
                                    <FaHeart
                                        title="Đã có trong danh sách yêu thích"
                                        style={{ color: "red" }}
                                        onClick={(e) => hanleClickWishList(e)}   // thêm toggle
                                        className={clsx(styles.icon_style)}
                                    />
                                ) : (
                                    <FaHeart
                                        title="Thêm vào danh sách yêu thích"
                                        onClick={(e) => hanleClickWishList(e)}   // sửa lại cho đúng
                                        className={clsx(styles.icon_style)}
                                    />
                                )
                            }

                        </div>
                        <div
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title="Thêm vào giỏ hàng"
                        >
                            {
                                current?.cart.some((item) => item.product.toString() == dataProduct._id) ? (
                                    <BsFillCartCheckFill
                                        title="Đã có trong giỏ"
                                        style={{ color: "green" }}
                                        className={clsx(styles.icon_style)}
                                    />
                                ) : (
                                    <FaCartPlus
                                        title="Thêm vào giỏ"
                                        onClick={() => hanleAddtoCart()}
                                        className={clsx(styles.icon_style)}
                                    />
                                )
                            }
                        </div>

                        <div
                            onClick={(e) => hanleQuickView(e)}
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title="Xem nhanh"
                        >
                            <FaEye className={clsx(styles.icon_style)} />
                        </div>
                    </div>
                </div>
                <div className={clsx(styles["clamp-2"])}>
                    <p><b>{dataProduct.title}</b></p>
                </div>
                <div>
                    <p style={{ color: "red" }}><b>{price} đ</b></p>
                </div>
                <div className="d-flex align-items-center">
                    <div>
                        <IoMdStar style={{ color: "#FCC200", fontSize: "20px" }} />
                    </div>
                    <div>{dataProduct.totalRating}</div>
                    <div>
                        - Đã bán {dataProduct.sold}
                    </div>
                </div>
                <div style={{ position: "absolute", fontWeight: "bold", color: "white", backgroundColor: "red", borderRadius: "50%", padding: "8px 3px", top: "8px" }}>
                    -16%
                </div>
            </div >
        </>
    </>
}


export default WithBaseComponent(memo(Product));