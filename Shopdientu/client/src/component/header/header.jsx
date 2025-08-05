import "./header.css"
import { FaSearch, FaRegUser, FaShoppingCart, FaBlog, FaQuestionCircle } from "react-icons/fa";
import { GiPositionMarker } from "react-icons/gi";

import { BiSolidContact } from "react-icons/bi";
import { path } from "../../ultils/path";
import { Link } from "react-router-dom";
import Navbar from "../navbar/Navbar"
import { useEffect, useState } from "react";



const Header = () => {

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
                style={{ backgroundColor: "#ffd400", top: showBanner ? "47px" : "0", zIndex: 1030, }}
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
                                <Link className="nav-link" to={path.LOGIN}>
                                    <FaRegUser /> Đăng nhập
                                </Link>
                            </li>
                            <li className="nav-item text-nowrap hover_item">
                                <Link className="nav-link" to="#">
                                    <FaShoppingCart /> Giỏ hàng
                                </Link>
                            </li>
                            <li className="nav-item text-nowrap hover_item">
                                <Link className="nav-link" to={path.BLOG}>
                                    <FaBlog /> Blog
                                </Link>
                            </li>
                            <li className="nav-item text-nowrap hover_item">
                                <Link className="nav-link" to={path.FAQ}>
                                    <FaQuestionCircle /> FAQS
                                </Link>
                            </li>
                            <li className="nav-item text-nowrap hover_item">
                                <Link className="nav-link" to={path.CONTACT}>
                                    <BiSolidContact /> Liên hệ
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>


            <div style={{ marginTop: showBanner ? "55px" : "9px" }}>
                <Navbar />
            </div>
        </div>
    </>
}

export default Header;