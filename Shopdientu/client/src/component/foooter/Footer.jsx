import styles from "./Footer.module.css"
import { useEffect, memo } from "react";

const Footer = () => {
    useEffect(() => {
        // Khởi tạo SDK Facebook
        if (!window.FB) {
            window.fbAsyncInit = function () {
                window.FB.init({
                    xfbml: true,
                    version: "v19.0",
                });
            };

            const script = document.createElement("script");
            script.src = "https://connect.facebook.net/vi_VN/sdk.js";
            script.async = true;
            script.defer = true;
            script.crossOrigin = "anonymous";
            script.nonce = "123";
            document.body.appendChild(script);
        } else {
            // Nếu đã có FB thì chỉ cần parse lại
            window.FB.XFBML.parse();
        }
    }, []);


    return <>
        <div className="row p-3 w-100 mt-3" style={{ fontSize: "14px" }}>
            {/* Cột 1 */}
            <div className="col-12 col-md-3 mb-4">
                <div className="text-danger text-center mb-3">
                    <h1 style={{ fontSize: "36px", fontWeight: "700" }}>DUNGNV</h1>
                </div>
                <div><h5><b>Địa chỉ:</b></h5></div>
                <div><b>Cơ sở 1:</b> 221 Vũ Tông Phan - Thanh Xuân - Hà Nội</div>
                <div><b>Cơ sở 2:</b> 17 Nguyễn Phong Sắc - Cầu Giấy - Hà Nội</div>
                <div><b>Cơ sở 3:</b> 145 Minh Khai - Hai Bà Trưng - Hà Nội</div>
                <div className="mt-2">
                    Gọi mua hàng: <b>0825.303.888</b> (8h00 - 22h00)
                </div>
                <div>
                    Gọi bảo hành: <b>0922.702.888</b> (8h00 - 21h00)
                </div>
            </div>

            {/* Cột 2 */}
            <div className="col-12 col-md-3 mb-4" style={{ lineHeight: "1.6" }}>
                <div><h5><b>Chính sách</b></h5></div>
                <p className="mb-1">Chính sách mua hàng</p>
                <p className="mb-1">Chính sách đổi trả</p>
                <p className="mb-1">Chính sách bảo hành</p>
                <p className="mb-1">Cam kết chất lượng</p>
                <p className="mb-1">Chính sách bảo mật</p>
                <p className="mb-1">Hệ thống cửa hàng</p>
            </div>

            {/* Cột 3: Fanpage */}
            <div className="col-12 col-md-3 mb-4">
                <div><h5><b>Fanpage</b></h5></div>
                <div id="fb-root"></div>
                <div
                    className="fb-page w-100"
                    data-href="https://www.facebook.com/fakerfanpagevn"
                    data-tabs="timeline"
                    data-width=""
                    data-height="300"
                    data-small-header="false"
                    data-adapt-container-width="true"
                    data-hide-cover="false"
                    data-show-facepile="true"
                ></div>
            </div>


            <div className="col-12 col-md-3 mb-4">
                <div>
                    <b>  Nhận phản hồi, thắc mắc:</b>
                </div>
                <div>
                    <p>dungnv.com.vn@gmail.com</p>
                </div>
                <div>
                    <b>Tư vấn miễn phí 24/07</b>
                </div>
                <div>
                    0825.303.888

                </div>
            </div>
        </div>

        <div className="text-center py-2 bg-danger text-white fw-bold">
            Bản quyền 2023 - Thiết kế bởi Dungnv
        </div>

    </>
}



export default memo(Footer);