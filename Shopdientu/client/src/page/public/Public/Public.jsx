import "./Public.css"
import { Outlet } from "react-router-dom";
import { Header, Footer } from "../../../component"
const Public = () => {
    return <>
        <div>
            <Header />
        </div>
        <div className="container" style={{ minHeight: "calc(100vh - 100px)", paddingTop: "110px" }}>
            <Outlet />
        </div>
        <div>
            <Footer />
        </div>
    </>
}

export default Public;