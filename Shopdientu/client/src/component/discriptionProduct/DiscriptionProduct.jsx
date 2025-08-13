import { useState } from "react";
import { Rate } from "antd";
import styles from "./DescriptionProduct.module.css";
import { FaHeart } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import clsx from "clsx";
import RatingProgress from "../RatingProgress/RatingProgress";
const tabs = ["Bài viết đánh giá", "Thông số kĩ thuật", "Đánh giá"];


const DescriptionProduct = ({ description = "Chưa có mô tả sản phẩm", rating = [], totalrating = 0 }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const maxLength = 200;
    const [indextab, setIndexTab] = useState(0);
    console.log(rating)
    const displayText = isExpanded
        ? description
        : description?.slice(0, maxLength) + (description?.length > maxLength ? "..." : "");

    const stats = Array.from({ length: 5 }, (_, i) => ({
        star: 5 - i,
        count: 0
    }));

    // Đếm số lượng sao
    rating.forEach(rating => {
        const found = stats.find(s => s.star === rating.star);
        if (found) found.count += 1;
    });

    const total = stats.reduce((sum, s) => sum + s.count, 0);

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
                    <div className="row gap-5">
                        <div className="col-4" style={{ display: "flex", justifyContent: "center", alignItems: "center", border: "1px solid gray" }}>
                            <div className="" >
                                <div style={{ fontSize: "30px", color: "rgb(255, 212, 0)" }}>{totalrating} <span>★</span></div>
                                <div><b>Đánh giá trung bình</b></div>
                            </div>
                        </div>
                        <div className="col-6">
                            <RatingProgress stats={stats} total={total} />
                        </div>
                    </div>
                    <div className="" style={{ margin: "30px 0" }}>
                        <h3 style={{ margin: "15px 0" }}>Bình luận đánh giá</h3>
                        {
                            rating?.map((item, index) => {
                                console.log(item)
                                return <div>
                                    <div><b>{item?.postedBy?.name}</b> ✅ <span style={{ color: "#2ba832" }}>đã mua hàng tại Shop dungnv</span></div>
                                    <Rate allowHalf defaultValue={item?.star} /> | <span><FaHeart style={{ color: "red" }} />Sẽ giới thiệu cho bạn bè, người thân</span>
                                    <p>{item?.comment}</p>
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

