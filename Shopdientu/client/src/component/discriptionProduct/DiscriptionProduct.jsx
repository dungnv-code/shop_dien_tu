import { useState } from "react";
import { Rate } from "antd";
import styles from "./DescriptionProduct.module.css";
import { FaHeart } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import clsx from "clsx";
import RatingProgress from "../RatingProgress/RatingProgress";
const tabs = ["Bài viết đánh giá", "Thông số kĩ thuật", "Đánh giá"];
import { Ratings } from "../../api/Product";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import moment from "moment";
import 'moment/locale/vi';


const DescriptionProduct = ({ name, pid, description = "Chưa có mô tả sản phẩm", rating = [], totalrating = 0 }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const maxLength = 200;
    const [indextab, setIndexTab] = useState(0);
    const { isLogIn } = useSelector(state => state.user);
    const [textrate, setTextRate] = useState("");
    const [starrate, setStarState] = useState(0);
    const navigate = useNavigate();
    moment.locale('vi');
    const displayText = isExpanded
        ? description
        : description?.slice(0, maxLength) + (description?.length > maxLength ? "..." : "");

    const stats = Array.from({ length: 5 }, (_, i) => ({
        star: 5 - i,
        count: 0
    }));
    let soluongdg = 0;
    // Đếm số lượng sao
    rating.forEach(rating => {
        const found = stats.find(s => s.star === rating.star);
        if (found) found.count += 1;
        soluongdg += 1;
    });

    const total = stats.reduce((sum, s) => sum + s.count, 0);

    const hideModal = () => {
        const modalEl = document.getElementById('modal_rate');
        const modalInstance = bootstrap.Modal.getInstance(modalEl)
            || new bootstrap.Modal(modalEl); // Nếu chưa khởi tạo
        modalInstance.hide();
    }

    const hanleRating = async () => {
        if (!isLogIn) {
            Swal.fire({
                title: 'Bạn cần đăng nhập để đánh giá sản phẩm',
                icon: 'warning',
                confirmButtonText: 'Đăng nhập',
                showCancelButton: true,
            })
                .then((result) => {
                    if (result.isConfirmed) {
                        hideModal();
                        setTextRate("");
                        setStarState(0);
                        navigate('/login')
                    }
                });
            return;
        }
        if (starrate === 0 || textrate === "") {
            alert("Vui lòng nhập đầy đủ thông tin đánh giá");
            return;
        }

        const data = {
            pid,
            star: starrate,
            comment: textrate
        };

        const res = await Ratings(data);
        if (res) {
            hideModal();
            Swal.fire({
                title: 'Cảm ơn bạn đã đánh giá sản phẩm',
                icon: 'success',
                confirmButtonText: 'OK',
                timer: 3000,
                showCancelButton: true,
            })
            setTextRate("");
            setStarState(0);
        }
    }

    return <>
        <div className="d-flex">
            {
                tabs.map((tab, index) => {
                    return <div key={index} onClick={() => { setIndexTab(index) }}>
                        <div className={clsx(styles["btn-mution"], { [styles["active"]]: index === indextab })}>{tab}</div>
                    </div>
                })
            }
        </div>
        <div className="p-2">
            {indextab === 0 && (
                <div>
                    <p>{displayText}</p>
                    {description?.length > maxLength && (
                        <button
                            type="button"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="btn btn-info"
                        >
                            {isExpanded ? "Thu gọn" : "Xem thêm"}
                        </button>
                    )}
                </div>
            )}
            {indextab === 2 && (
                <>
                    {/* modal rate */}
                    <div className="modal fade" id="modal_rate" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">Đánh giá sản phẩm {name}</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <textarea className="form-control rounded-3 p-3" value={textrate} onChange={(e) => { setTextRate(e.target.value) }} rows="4" placeholder="Nhập nội dung..."></textarea>
                                    <div className="d-flex justify-content-between align-items-center mt-3">
                                        <div className="d-flex align-items-center gap-2">
                                            <span>Đánh giá:</span>
                                            <Rate value={starrate} onChange={(value) => { setStarState(value) }} />
                                        </div>
                                        <div className="text-end">
                                            <span>Đánh giá trung bình: {totalrating}/5</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Huỷ</button>
                                    <button type="button" className="btn btn-primary" onClick={() => { hanleRating() }} >Thêm đánh giá</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* body */}
                    <div className="row gap-5">
                        <div className="col-3" style={{ display: "flex", justifyContent: "center", alignItems: "center", border: "1px solid gray" }}>
                            <div className="" >
                                <div style={{ fontSize: "30px", color: "rgb(255, 212, 0)" }}>{totalrating}/5 <span>★</span></div>
                                <div><b>Đánh giá trung bình</b></div>
                                <div>(Số lượt đánh giá {soluongdg})</div>
                            </div>
                        </div>
                        <div className="col-5">
                            <RatingProgress stats={stats} total={total} />
                        </div>
                        <div className="col-2 d-flex justify-content-center align-items-center ">
                            <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modal_rate" style={{ width: "100%" }}>
                                <FaRegUser /> Viết đánh giá
                            </button>
                        </div>
                    </div>
                    <div className="" style={{ margin: "30px 0" }}>
                        <h3 style={{ margin: "15px 0" }}>Bình luận đánh giá</h3>
                        {
                            rating?.map((item, index) => {

                                return <div key={index}>
                                    <div><b>{item?.postedBy?.name}</b> ✅ <span style={{ color: "#2ba832" }}>đã mua hàng tại Shop dungnv</span></div>
                                    <Rate defaultValue={item?.star} disabled /> | <span><FaHeart style={{ color: "red" }} />Sẽ giới thiệu cho bạn bè, người thân</span>
                                    <p>{item?.comment}</p>
                                    <div>{moment(item?.updateAt).fromNow()} trước</div>
                                </div>
                            })
                        }
                    </div>
                </>
            )}
        </div >
    </>
}

export default DescriptionProduct;

