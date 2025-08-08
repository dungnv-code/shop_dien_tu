import "./Login.css"
import { Input, Button } from "../../../component";
import { useCallback, useEffect, useState } from "react";
import { LoginUser, RegisterUser } from "../../../api/User"
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom";
import { path } from "../../../ultils/path";
import { useDispatch } from "react-redux";
import { resgister } from "../../../redux/userSlice/userSlice"
const Login = () => {
    const navigate = useNavigate();
    const dispath = useDispatch();
    const [payload, setPayload] = useState({
        name: "",
        password: "",
        email: "",
        mobile: "",
    });

    const [isRegister, setRegister] = useState(false);
    useEffect(() => {
        setPayload({
            name: "",
            password: "",
            email: "",
            mobile: "",
        })
    }, [isRegister])

    const hanleSubmit = useCallback(async (e) => {
        e.preventDefault();
        const { name, phone, ...data } = payload;
        if (isRegister) {
            const response = await RegisterUser(payload);
            if (response.sucess) {
                Swal.fire({
                    icon: "success",
                    title: "Đăng kí thành công!",
                    // text: data.mes || "Chào mừng bạn đến với trang web.",
                    confirmButtonText: "Đi đến đăng nhập"
                }).then((result) => {
                    if (result.isConfirmed) {
                        setRegister(false);
                    }
                });
            }
        } else {
            const response = await LoginUser(data);
            console.log(response);
            if (response.sucess) {
                console.log(response)
                dispath(resgister({
                    isLogIn: true, current: response.userData, token: response.accessToken
                }));
                Swal.fire({
                    icon: "success",
                    title: "Đăng nhập thành công!",
                    text: data.mes || "Chào mừng bạn đến với trang web.",
                    confirmButtonText: "Về trang chủ"
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate(`/${path.HOME}`);
                    }
                });
            }
        }
    })

    return <>
        <div style={{ position: "relative" }}>
            <img
                src="https://i.pinimg.com/1200x/9c/60/1d/9c601db2ad806b6ff0d6dca1c4b01169.jpg"
                style={{ height: "100vh", objectFit: "cover", width: "100%" }}
                alt=""
            />
            <div
                style={{
                    position: "absolute",
                    top: "100px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "white",
                    padding: "30px",
                    borderRadius: "10px",
                    width: "90%",
                    maxWidth: "500px",
                    minWidth: "300px",
                    boxSizing: "border-box",
                }}
            >

                <div
                    className="text-center text-gray"
                    style={{ fontSize: "24px", fontWeight: "bold" }}
                >
                    {isRegister ? "Đăng kí" : "ĐĂNG NHẬP"}
                </div>

                <form>
                    {isRegister && (
                        <div className="mb-3">
                            <Input
                                type="text"
                                name="name"
                                value={payload.name}
                                setValue={setPayload}
                                placeholder="Họ và tên"
                            />
                        </div>

                    )}

                    <div className="mb-3">
                        <Input
                            type="text"
                            name="email"
                            value={payload.email}
                            setValue={setPayload}
                            placeholder="Email"
                        />
                    </div>


                    {isRegister && (
                        <div className="mb-3">
                            <Input
                                type="text"
                                name="mobile"
                                value={payload.mobile}
                                setValue={setPayload}
                                placeholder="Số điện thoại"
                            />
                        </div>
                    )}

                    <div className="mb-3">
                        <Input
                            type="password"
                            name="password"
                            value={payload.password}
                            setValue={setPayload}
                            placeholder="Mật khẩu"
                        />
                    </div>

                    <Button
                        name={isRegister ? "Đăng kí" : "Đăng nhập"}
                        hanleOnclick={hanleSubmit}
                    />
                </form>

                <div className="d-flex justify-content-between mt-3">
                    {isRegister ? (
                        <></>
                    ) : (
                        <div>Quên mật khẩu</div>
                    )}

                    {isRegister ? (
                        <div onClick={() => setRegister(false)}>Quay lại đăng nhập</div>
                    ) : (
                        <div onClick={() => setRegister(true)}>Tạo tài khoản mới</div>
                    )}
                </div>
            </div>

        </div >


    </>
}

export default Login;