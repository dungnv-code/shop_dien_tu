import "./loading.css"


const Loading = () => {

    return <>
        <div style={{
            position: "absolute",
            left: "0",
            top: "0",
            right: "0",
            bottom: "0",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            width: "100%",
            zIndex: 1000,
        }}>
            <div
                className="d-flex flex-column justify-content-center align-items-center"
                style={{
                    height: "100vh",
                    background: "rgba(0, 0, 0, 0.6)", // nền mờ
                    color: "white"
                }}
            >
                <span
                    className="spinner-border"
                    role="status"
                    aria-hidden="true"
                    style={{
                        width: "4rem",
                        height: "4rem",
                        borderWidth: "6px",
                        color: "white", // màu vàng nổi bật
                        animationDuration: "pulse 0.8s" // xoay nhanh hơn
                    }}
                ></span>
                <span
                    style={{
                        marginTop: "15px",
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                        letterSpacing: "2px",
                        animation: "pulse 1.5s infinite"
                    }}
                >
                    Loading...
                </span>
            </div>
        </div>
    </>
}

export default Loading;