import "./header.css"
import { FaSearch, FaRegUser, FaShoppingCart, FaBlog, FaQuestionCircle } from "react-icons/fa";
import { useTranslation } from "react-i18next";

import { BiSolidContact } from "react-icons/bi";
import { path } from "../../ultils/path";
import { Link } from "react-router-dom";
import Navbar from "../navbar/Navbar"
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Header = () => {
    const { isLogIn, current } = useSelector(state => state.user);
    const [showBanner, setShowBanner] = useState(true);

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



    return <>
        <div>
            {/* Banner trên cùng */}
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
                style={{ backgroundColor: "#ffd400", top: showBanner ? "47px" : "0", zIndex: 900, }}
            >
                <div className="container-fluid" style={{ padding: "0 30px" }}>
                    {/* Logo */}
                    <Link className="navbar-brand fw-bold" to={`/${path.HOME}`}>
                        DungNV
                    </Link>

                    {/* Nút toggle (mobile) */}
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
                        <ul className="navbar-nav ms-auto mb-2 gap-3 mb-lg-0">
                            <li className="nav-item text-nowrap  hover_item">
                                {
                                    isLogIn ? <>
                                        <Link className="nav-link" to={path.LOGIN}>
                                            <FaRegUser /> {current.name}
                                        </Link>
                                    </> :
                                        (<>
                                            <Link className="nav-link" to={path.LOGIN}>
                                                <FaRegUser /> Đăng nhập
                                            </Link>
                                        </>)
                                }
                            </li>
                            <li className="nav-item text-nowrap hover_item">
                                <Link className="nav-link" to="#">
                                    <FaShoppingCart /> Giỏ hàng
                                </Link>
                            </li>
                            <li className="nav-item text-nowrap">
                                <div className="dropdown" >
                                    <div className="btn  dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                        Thông tin
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
                        </ul>
                    </div>
                </div>
            </nav >


            <div style={{ marginTop: showBanner ? "55px" : "9px" }}>
                <Navbar />
            </div>
        </div >
    </>
}

export default Header;