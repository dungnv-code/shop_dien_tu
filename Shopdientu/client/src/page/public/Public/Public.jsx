import "./Public.css"
import { Outlet } from "react-router-dom";
import { Header, Footer } from "../../../component"
import { ChatWidget } from "../../../component"
const Public = () => {
    return <>
        <div style={{ position: "relative" }}>
            <div style={{ position: "fixed", bottom: "5%", right: "5%", zIndex: 1000 }}>
                <div
                    className="bg-info"
                    style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <ChatWidget />
                </div>
            </div>
            <div>
                <Header />
            </div>
            <div className="container" style={{ minHeight: "calc(100vh - 100px)", paddingTop: "110px" }}>
                <Outlet />
            </div>
            <div>
                <Footer />
            </div>

        </div>
    </>
}

export default Public;