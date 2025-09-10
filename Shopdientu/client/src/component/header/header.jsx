import "./header.css"
import { FaSearch, FaRegUser, FaShoppingCart, FaBlog, FaQuestionCircle } from "react-icons/fa";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { IoIosLogOut } from "react-icons/io";
import { useTranslation } from "react-i18next";
import { BiSolidContact } from "react-icons/bi";
import { FaRegWindowClose } from "react-icons/fa";
import { path } from "../../ultils/path";
import { Link } from "react-router-dom";
import Navbar from "../navbar/Navbar"
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getCurrent } from "../../redux/userSlice/asyncActionUser";
import { LogOut } from "../../redux/userSlice/userSlice";
import { LogoutUser, RemoveCart } from "../../api/User";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
const Header = () => {
    const { isLogIn, current } = useSelector(state => state.user);
    const [showBanner, setShowBanner] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate()
    useEffect(() => {
        isLogIn && dispatch(getCurrent());
    }, [isLogIn, dispatch]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setShowBanner(false); // Chỉ cần có scroll là ẩn
            } else {
                setShowBanner(true); // Trở về đầu trang thì hiện lại
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const { i18n, t } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem("lang", lng);
    };

    const hanleRemoveCart = (id) => {
        const FeatchRemoveCart = async () => {
            try {
                const reponse = await RemoveCart(id)
                await dispatch(getCurrent())
                Swal.fire({
                    title: reponse?.mes || 'Xoá thành công',
                    icon: 'success',
                    timer: 1000, // 2 giây
                    showConfirmButton: false // ẩn nút OK
                })
            } catch (err) {
                Swal.fire({
                    title: err?.mes || 'Đã có lỗi sảy ra',
                    icon: 'error',
                    timer: 2000, // 2 giây
                    showConfirmButton: false // ẩn nút OK
                })
            }
        }
        FeatchRemoveCart()
    }

    const hanleLogOut = async (e) => {
        e.preventDefault();
        const data = await dispatch(LogOut());
        await LogoutUser();
    }

    return <>
        <div>
            <div className="offcanvas offcanvas-end bg-dark text-white" id="cart">
                <div className="offcanvas-header">
                    <h1 className="offcanvas-title">Giỏ hàng</h1>
                    <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas"></button>
                </div>
                <div className="offcanvas-body">
                    <div>
                        {
                            current?.cart.length == 0 && "Chưa có sản phẩm nào trong giỏ hàng"
                        }
                        {
                            current?.cart.map((item, index) => {
                                return <div key={index} className="d-flex justify-content-between align-items-center p-2">
                                    <div>
                                        <img src={item.image} style={{ objectFit: "contain" }} width={"70px"}></img>
                                    </div>
                                    <div>
                                        <p
                                            style={{
                                                whiteSpace: "nowrap",       // ép 1 dòng duy nhất
                                                overflow: "hidden",         // ẩn phần dư
                                                textOverflow: "ellipsis",   // thêm dấu ...
                                                maxWidth: "200px",          // phải có width hoặc maxWidth
                                                display: "block",
                                            }}
                                        >
                                            {item.name}
                                        </p>
                                        <div>{item.price} vnđ</div>
                                        <div>Slượng: {item.quantity}</div>
                                    </div>
                                    <div>
                                        <button type="button" onClick={() => { hanleRemoveCart(item._id) }} className="btn btn-primary"><FaRegWindowClose /></button>
                                    </div>
                                </div>
                            })
                        }
                    </div>
                    <hr />
                    <div className="p-2">
                        Tổng : {current?.cart.reduce((sum, el) => sum + el.price * el.quantity, 0).toLocaleString("vi-VN")} vnđ
                    </div>
                    <button className="btn btn-secondary" onClick={() => { navigate(`/${path.DETAILCART}`) }} type="button">
                        Giỏ Hàng</button>
                </div>
            </div>
            <div>
                <div>
                    <img
                        src="https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/be/b4/beb45d43aa9e49302f0148ff234854a1.png"
                        alt="logo_tren"
                        className="w-100"
                        style={{ height: "47px", objectFit: "cover" }}
                    />
                </div>
            </div>
            <nav
                className="navbar navbar-expand-lg fixed-top navbar-light"
                style={{ backgroundColor: "#ffd400", display: "flex", flexDirection: "column", top: showBanner ? "47px" : "0", zIndex: 900, }}
            >
                <div className="container-fluid" style={{ padding: "0 30px" }}>
                    <Link className="navbar-brand fw-bold" to={`/${path.HOME}`}>
                        DungNV
                    </Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {/* Form search */}
                    <div className="d-none d-lg-block mx-auto" style={{ maxWidth: "400px", width: "100%" }}>
                        <form className="d-flex">
                            <input
                                className="form-control me-2"
                                type="search"
                                placeholder="Search"
                                aria-label="Search"
                            />
                            <button className="btn btn-outline-dark" type="submit">
                                <FaSearch />
                            </button>
                        </form>
                    </div>

                    {/* Các nút bên phải */}
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex flex-row align-items-center gap-3">
                            <li className="nav-item dropdown  text-nowrap">
                                <div className="dropdown" >
                                    <div className="btn  dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                        <BsFillInfoCircleFill />   Thông tin
                                    </div>
                                    <ul className="dropdown-menu m-2" aria-labelledby="dropdownMenuButton1">
                                        <li>
                                            <Link className="nav-link dropdown-item" to={path.BLOG}>
                                                <FaBlog /> {t("blog")}
                                            </Link></li>
                                        <li>
                                            <Link className="nav-link dropdown-item" to={path.FAQ}>
                                                <FaQuestionCircle /> {t("faq")}
                                            </Link></li>
                                        <li >
                                            <Link className="nav-link dropdown-item" to={path.CONTACT}>
                                                <BiSolidContact /> {t("contact")}
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle"
                                    href="#"
                                    id="languageDropdown"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    🌐 {i18n.language === "vi" ? "Tiếng Việt" : "English"}
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="languageDropdown">
                                    <li>
                                        <button className="dropdown-item" onClick={() => changeLanguage("vi")}>
                                            🇻🇳 Tiếng Việt
                                        </button>
                                    </li>
                                    <li>
                                        <button className="dropdown-item" onClick={() => changeLanguage("en")}>
                                            🇺🇸 English
                                        </button>
                                    </li>
                                </ul>
                            </li>
                            <li className="nav-item text-nowrap hover_item">
                                <Link className="nav-link" data-bs-toggle="offcanvas" data-bs-target="#cart" to="#">
                                    <FaShoppingCart /> Giỏ hàng ({current?.cart?.length ?? 0})
                                </Link>
                            </li>
                            <li className="nav-item text-nowrap  hover_item">
                                {
                                    isLogIn ? (<>
                                        <div className="nav-item dropdown">
                                            <Link className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                                                <FaRegUser /> {current?.name}
                                            </Link>
                                            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="languageDropdown">
                                                <li>
                                                    <Link className="dropdown-item" to={path.PROFILE} >
                                                        Profile
                                                    </Link>
                                                </li>
                                                {isLogIn && current?.role === "1945" && (
                                                    <li>
                                                        <Link className="dropdown-item" to={`${path.MEMBER}/${path.PERSONAL}`}>
                                                            Riêng tư
                                                        </Link>
                                                    </li>
                                                )}
                                                {isLogIn && current?.role === "1975" && (
                                                    <li>
                                                        <Link className="dropdown-item" to={`${path.ADMIN}/${path.MANAGER_USER}`}>
                                                            Quản lý
                                                        </Link>
                                                    </li>
                                                )}
                                                <li>
                                                    <button className="dropdown-item" onClick={(e) => { hanleLogOut(e) }} >
                                                        <IoIosLogOut />   Đăng xuất
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </>) :
                                        (<>
                                            <Link className="nav-link" to={path.LOGIN}>
                                                <FaRegUser /> Đăng nhập
                                            </Link>
                                        </>)
                                }
                            </li>
                        </ul>
                    </div>
                </div>
                <div >
                    <Navbar />
                </div>
            </nav >
        </div >
    </>
}

export default Header;