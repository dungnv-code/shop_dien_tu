import styles from "./product.module.css"
import { IoMdStar, IoMdMenu } from "react-icons/io";
import { FaEye, FaHeart } from "react-icons/fa";
import { memo } from "react";
import clsx from "clsx"
import { Link } from "react-router-dom";
import { path } from "../../ultils/path";
import { toSlug } from "../../ultils/helper";
const Product = ({ dataProduct }) => {
    const price = dataProduct.price.toLocaleString();
    return <>
        <Link to={`/${toSlug(dataProduct.category)}/${dataProduct._id}/${dataProduct.slug}`}>
            <div style={{ width: "100%", position: "relative", fontSize: "14px" }} className={clsx(styles.border_shadow, "h-100", "p-3")}>
                <div className="p-1" style={{ position: "relative" }}>
                    {
                        dataProduct.image ? <> <img src={dataProduct.image} style={{ objectFit: "contain" }} width={"100%"} height={"163px"} alt="amh"></img></>
                            : <><img src="https://i.pinimg.com/736x/fb/c4/87/fbc487b4b3a80a130c52dcb5c1bd7bee.jpg" style={{ objectFit: "contain" }} width={"100%"} height={"163px"} alt="amh"></img></>
                    }
                    <div className={clsx(styles.hover_icon)} style={{ width: "100%", position: "absolute", display: "flex", gap: 10, justifyContent: "center" }}>
                        <FaHeart className={clsx(styles.icon_style)} />
                        <IoMdMenu className={clsx(styles.icon_style)} />
                        <FaEye className={clsx(styles.icon_style)} />
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
                        - Đã bán 2000k
                    </div>
                </div>
                <div style={{ position: "absolute", fontWeight: "bold", color: "white", backgroundColor: "red", borderRadius: "50%", padding: "8px 3px", top: "8px" }}>
                    -16%
                </div>
            </div >
        </Link>
    </>
}


export default memo(Product);