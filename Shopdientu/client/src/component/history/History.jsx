import styles from "./History.module.css"
import clsx from "clsx";
const History = () => {
    return <>
        <div className={clsx(styles.content_padding)} >
            <div className="p-3" >
                <h3>
                    Sản phẩm đã xem
                </h3>
                <div className={clsx("d-flex")} style={{ width: "250px", padding: "8px", borderRadius: "5px", border: "1px solid gray" }}>
                    <div>
                        <img src="https://res.cloudinary.com/dmzb0sepr/image/upload/v1752886989/cuahangdientu/ace2dpluimgdzx9dvc7n.png" width={"100px"} hight={"100px"}></img>
                    </div>
                    <div className={clsx(styles["clamp-2"])}>
                        <p>iPhone 13 Pro – 99% LikeNew</p>
                        <p>12500000</p>
                    </div>
                </div>
            </div>
        </div >
    </>
}

export default History;