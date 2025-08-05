import styles from "./Home.module.css"
import { History } from "../../../component";
import clsx from "clsx";
import { useEffect, useState } from "react"
import { FaRegTimesCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { Product } from "../../../component/"
import { getProducts } from "../../../api/Product";
import Slider from "react-slick";

var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
};

const Home = () => {

    const [hideimg, setHideimg] = useState(true);
    const categoris = useSelector((state) => { return state.app.categoris });
    const [tab, setTab] = useState(0);
    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        try {

            if (tab == 0) {
                const response = await getProducts({
                    params: { random: "true", limit: 5 }
                });
                return response.productDatas;
            }
            if (tab == 1) {
                const response = await getProducts({
                    params: { random: "true", limit: 5 }
                });
                return response.productDatas;
            }
            const response = await getProducts({
                params: { category: categoris[tab - 2].title }
            });

            return response.productDatas;
        } catch (error) {
            console.error("Lỗi khi fetch sản phẩm:", error);
            return [];
        }
    };

    useEffect(() => {
        const loadProducts = async () => {
            const data = await fetchProducts();
            setProducts(data);
        };

        loadProducts();
    }, [tab]);

    return <>
        <div className={clsx(styles.content_home)}>
            <div style={{ paddingTop: "20px", position: "relative" }}>
                {
                    hideimg ? (<>   <img src="https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/d8/4b/d84ba4cb006ff06acfe636fdc7ed6828.png" alt="img-header" style={{ objectFit: "cover" }} width={"100%"} height={"240px"}></img>
                        <div className={clsx(styles.position_img_header)}><FaRegTimesCircle className="fs-4" onClick={() => { setHideimg(false) }} /></div></>) : (<></>)
                }
            </div>
            <div style={{ margin: "10px 0" }}>
                <History />
            </div >
            <div style={{ margin: "10px 0" }}>
                <h3 style={{ padding: "10px 0" }}>Khuyến mãi Online</h3>
                <div className="" style={{ borderBottom: "1px solid gray", backgroundColor: "white", borderRadius: "7px", padding: "0 30px" }}>
                    <div
                        className="d-flex align-items-center text-center flex-wrap overflow-auto"
                        style={{ borderBottom: "1px solid gray", gap: "8px" }}
                    >
                        {/* Tab 0: Hình ảnh 1 */}
                        <NavLink
                            className={clsx(styles.img_khuyenmai, {
                                [styles.action_cate]: tab === 0,
                            })}
                            onClick={() => setTab(0)}
                            style={{
                                flex: "0 0 auto",
                                minWidth: "100px",
                                padding: "4px",
                            }}
                        >
                            <img
                                src="https://cdnv2.tgdd.vn/mwg-static/common/Campaign/10/0d/100d3018ffd23afe20324b164d0412cc.png"
                                width="100%"
                                height="40px"
                                alt="khuyenmai1"
                            />
                        </NavLink>

                        {/* Tab 1: Hình ảnh 2 */}
                        <NavLink
                            className={clsx(styles.img_khuyenmai, {
                                [styles.action_cate]: tab === 1,
                            })}
                            onClick={() => setTab(1)}
                            style={{
                                flex: "0 0 auto",
                                minWidth: "100px",
                                padding: "4px",
                            }}
                        >
                            <img
                                src="https://cdnv2.tgdd.vn/mwg-static/common/Campaign/7a/e0/7ae0723d3d978fd4c8a2c77f3bf4bd3a.png"
                                width="100%"
                                height="40px"
                                alt="khuyenmai2"
                            />
                        </NavLink>


                        {categoris?.map((item, index) => {
                            const realIndex = index + 2;
                            return (
                                <NavLink
                                    key={item._id}
                                    style={{
                                        flex: "0 0 auto",
                                        minWidth: "100px",
                                        padding: "4px",
                                        fontWeight: "bold",
                                        whiteSpace: "nowrap",
                                    }}
                                    onClick={() => setTab(realIndex)}
                                    className={clsx("p-2", {
                                        [styles.action_cate]: tab === realIndex,
                                    })}
                                >
                                    {item.title}
                                </NavLink>
                            );
                        })}
                    </div>
                    <div>
                        <div style={{ margin: "13px 0" }}>
                            <img src="https://cdnv2.tgdd.vn/mwg-static/common/Campaign/c8/b7/c8b756baf5f990d065abf3acd1de19f6.png" style={{ objectFit: "cover" }} height={"70px"} width={"100%"} alt="img"></img>
                        </div>
                    </div>

                    <div className="row gx-3">
                        {
                            products?.map((item, index) => (
                                <div
                                    key={index}
                                    className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-2 mb-3"
                                >
                                    <Product dataProduct={item} />
                                </div>
                            ))
                        }
                    </div>

                </div>

            </div>

            <div >
                <Slider {...settings}>
                    <div >
                        <img src="https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/61/a8/61a8388f6115b28400702b719efeeddc.png" width={"100%"} height={"180px"} alt="ac" />
                    </div >
                    <div >
                        <img src="https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/7b/5f/7b5fd4a835a6de2898807a5164f9021b.png" width={"100%"} height={"180px"} alt="ac" />
                    </div>
                    <div>
                        <img src="https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/ba/57/ba57929fe1878edf1c787e8a999037b2.png" width={"100%"} height={"180px"} alt="ac" />
                    </div>
                    <div >
                        <img src="https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/1c/f4/1cf4d2faf0ec0420edd5bded818b40e4.png" width={"100%"} height={"180px"} alt="ac" />
                    </div>
                </Slider>
            </div>
        </div >
    </>
}

export default Home;