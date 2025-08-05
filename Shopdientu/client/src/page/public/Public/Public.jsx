import "./Public.css"
import { Outlet } from "react-router-dom";
import { Header, Footer } from "../../../component"
const Public = () => {
    return <>
        <div>
            <Header />
        </div>
        <Outlet />
        <div>
            <Footer />
        </div>
    </>
}

export default Public;