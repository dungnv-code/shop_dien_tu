import "./Adminsibar.css";
import { path } from "../../ultils/path";
import { NavLink } from "react-router-dom";
import { FaUsers, FaBox, FaPlus, FaShoppingCart, FaChartBar } from "react-icons/fa";
const Adminsibar = () => {
    return (
        <>
            <nav
                className="navbar admin-sidebar navbar-dark vh-100 position-fixed"
                style={{ top: "0", left: "0", width: "20%" }}
            >
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">
                        <h2>DUNGNV</h2>
                    </a>
                </div>
                <ul className="nav flex-column w-100">
                    <li className="nav-item">
                        <NavLink
                            className="nav-link"
                            aria-current="page"
                            to={`${path.ADMIN}/${path.MANAGER_USER}`}
                        >
                            <FaUsers />   Quản lí người dùng
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to={`${path.ADMIN}/${path.MANAGER_PRODUCT}`}>
                            <FaBox />   Quản lí sản phẩm
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to={`${path.ADMIN}/${path.CREATE_PRODUCT}`}>
                            <FaPlus />  Tạo sản phẩm
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to={`${path.ADMIN}/${path.MANAGER_ORDER}`}>
                            <FaShoppingCart />  Quản lí đơn hàng
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to={`${path.ADMIN}/${path.DASHBOARD}`}>
                            <FaChartBar /> Dashboard
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </>

    );
}

export default Adminsibar;