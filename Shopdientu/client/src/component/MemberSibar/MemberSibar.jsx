import "./MemberSibar.css";
import { path } from "../../ultils/path";
import { NavLink } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaRegUser, FaHistory } from "react-icons/fa";
import { useSelector } from "react-redux";
const MemberSibar = () => {
    const { current } = useSelector(state => state.user);

    return (
        <>
            <nav
                className="navbar admin-sidebar navbar-dark vh-100 position-fixed"
                style={{ top: "0", left: "0", width: "20%" }}
            >
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">
                        <div className="text-center">
                            <img src={current.image} style={{ width: "80%", borderRadius: "50%" }}></img>
                            <h5 className="p-2">Cá nhân</h5>
                        </div>

                    </a>
                </div>
                <ul className="nav flex-column w-100">
                    <li className="nav-item">
                        <NavLink className="nav-link" to={`${path.MEMBER}/${path.PERSONAL}`}>
                            <FaRegUser /> Thông tin cá nhân
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink
                            className="nav-link"
                            aria-current="page"
                            to={`${path.MEMBER}/${path.WISHLIST}`}
                        >
                            <FaHeart />  Danh sách yêu thích
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to={`${path.MEMBER}/${path.MYCART}`}>
                            <FaShoppingCart /> Giỏ hành của tôi
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to={`${path.MEMBER}/${path.HISTORY}`}>
                            <FaHistory /> Lịch sử
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </>
    );
}

export default MemberSibar;