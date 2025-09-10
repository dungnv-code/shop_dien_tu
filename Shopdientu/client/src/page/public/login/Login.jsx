import "./Login.css"
import { Input, Button } from "../../../component";
import { useCallback, useEffect, useState } from "react";
import { LoginUser, RegisterUser, ForgotPasswordUser, finalRegisterUser } from "../../../api/User"
import Swal from "sweetalert2"
import { useNavigate, useSearchParams } from "react-router-dom";
import { path } from "../../../ultils/path";
import { useDispatch } from "react-redux";
import { LogIn } from "../../../redux/userSlice/userSlice";
// import { toast } from "react-toastify";
import { Loading } from "../../../component";
const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isload, setLoad] = useState(false);
    const [payload, setPayload] = useState({
        name: "",
        password: "",
        email: "",
        mobile: "",
    });

    const [searchParams] = useSearchParams();
    console.log(searchParams.get("redict"))

    const [emailForgot, setEmailForgot] = useState("");
    const [isRegister, setRegister] = useState(false);
    const [isComfirmRegister, setComfirmRegister] = useState(false);
    const [codeComfirmRegister, setCodeComfirmRegister] = useState("");
    useEffect(() => {
        setPayload({
            name: "",
            password: "",
            email: "",
            mobile: "",
        })
    }, [isRegister])

    useEffect(() => {
        setCodeComfirmRegister("")
    }, [isComfirmRegister])

    const [forgot, setForgot] = useState(false);

    const hanleSubmit = useCallback(async (e) => {
        e.preventDefault();
        const { name, phone, ...data } = payload;
        if (isRegister) {
            setLoad(true)
            try {
                const response = await RegisterUser(payload);
                if (response.success) {
                    setComfirmRegister(true);
                }
            } finally {
                setLoad(false)
            }
        } else {
            setLoad(true);
            try {
                const response = await LoginUser(data);
                if (response.success) {
                    dispatch(LogIn({
                        isLogIn: true,
                        current: response.userData,
                        token: response.accessToken
                    }));
                    Swal.fire({
                        icon: "success",
                        title: "Đăng nhập thành công!",
                        text: data.mes || "Chào mừng bạn đến với trang web.",
                        confirmButtonText: "Về trang chủ"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            searchParams.get("redict") ? navigate(searchParams.get("redict")) : navigate(`${path.HOME}`);
                        }
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Đăng nhập thất bại",
                        text: response.mes || "Vui lòng kiểm tra lại thông tin."
                    });
                }
            } finally {
                setLoad(false);
            }
        }
    })

    const hanleForgot = useCallback(async (e) => {
        e.preventDefault();
        setLoad(true);
        const data = await ForgotPasswordUser({ "email": emailForgot });
        try {
            if (data.success) {
                Swal.fire({
                    icon: "success",
                    title: "Vui lòng check email của bạn!",
                    confirmButtonText: "Xác nhận"
                }).then((result) => {
                    if (result.isConfirmed) {
                        setEmailForgot("");
                    }
                });
            }
        } finally {
            setLoad(false);
        }

    })

    const hanleFinalRegister = useCallback(async (e) => {
        e.preventDefault();
        const data = await finalRegisterUser(codeComfirmRegister);
        if (data.success) {
            Swal.fire({
                icon: "success",
                title: "Thành Công!",
                text: data.mes || "Chào mừng bạn đến với trang web.",
                confirmButtonText: "Đi đến đăng nhập"
            }).then((result) => {
                if (result.isConfirmed) {
                    setComfirmRegister(false);
                    setRegister(false);
                }
            });
        }
    })

    return <>
        <div style={{ position: "relative" }}>
            <img
                src="https://i.pinimg.com/1200x/9c/60/1d/9c601db2ad806b6ff0d6dca1c4b01169.jpg"
                style={{ height: "100vh", objectFit: "cover", width: "100%" }}
                alt=""
            />

            {
                isload && <Loading ></Loading>
            }

            {/* quên mật khẩu */}
            {
                forgot && <div style={{
                    position: "absolute",
                    left: "0",
                    top: "0",
                    right: "0",
                    bottom: "0",
                    backgroundColor: "white",
                    padding: "50px",
                    width: "100%",
                    boxSizing: "border-box",
                    zIndex: 50,
                }}>
                    <div>
                        <h2 className="text-center">QUÊN MẬT KHẨU</h2>
                        <div className="p-2">
                            <label htmlFor="email">
                                Nhập vào Email của bạn:
                            </label>
                            <input type="text" className="form-control custom-input" value={emailForgot} onChange={(e) => { setEmailForgot(e.target.value) }} placeholder="Enter your Email"></input>
                        </div>
                        <div className="text-end p-2">
                            <button type="button" className="btn btn-info" onClick={(e) => { hanleForgot(e) }} style={{ marginRight: "10px" }}>Gửi email</button>
                            <button type="button" onClick={() => { setForgot(false) }} className="btn btn-info" >Trở về</button>
                        </div>
                    </div>
                </div>
            }
            {/* xác nhận đăng kí  */}
            {
                isComfirmRegister && <div style={{
                    position: "absolute",
                    left: "0",
                    top: "0",
                    right: "0",
                    bottom: "0",
                    backgroundColor: "white",
                    padding: "50px",
                    width: "100%",
                    boxSizing: "border-box",
                    zIndex: 50,
                }}>
                    <div>
                        <h2 className="text-center">Xác Nhận Đăng Kí</h2>
                        <div className="p-2">
                            <label htmlFor="email">
                                Nhập vào Code của bạn:
                            </label>
                            <input type="password" className="form-control custom-input" value={codeComfirmRegister} onChange={(e) => { setCodeComfirmRegister(e.target.value) }} placeholder="Enter your Code"></input>
                        </div>
                        <div className="text-end p-2">
                            <button type="button" className="btn btn-info" onClick={(e) => { hanleFinalRegister(e) }} style={{ marginRight: "10px" }}>Xác nhận</button>
                            <button type="button" onClick={() => { setComfirmRegister(false) }} className="btn btn-info" >Trở về</button>
                        </div>
                    </div>
                </div>
            }
            {/* đăng nhập và đăng kí */}
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
                {/* footer form  */}
                <div className="d-flex justify-content-between mt-3">
                    {isRegister ? (
                        <></>
                    ) : (
                        <div className="text-info" onClick={() => { setForgot(true) }}>Quên mật khẩu</div>
                    )}

                    {isRegister ? (
                        <div className="text-info" onClick={() => setRegister(false)}>Quay lại đăng nhập</div>
                    ) : (
                        <div className="text-info" onClick={() => setRegister(true)}>Tạo tài khoản mới</div>
                    )}
                </div>
            </div>


        </div >


    </>
}

export default Login;