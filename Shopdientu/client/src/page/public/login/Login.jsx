import "./Login.css"
import { Input, Button } from "../../../component";
import { useState } from "react";
const Login = () => {

    const [payload, setPayload] = useState({
        firstname: "",
        lastname: "",
        password: "",
        email: "",
    });

    const [isRegister, setRegister] = useState(false);

    const hanleSubmit = (e) => {
        e.preventDefault();
        console.log(payload)
    }

    return <>
        <div style={{ position: "relative" }}>
            <img
                src="https://i.pinimg.com/1200x/40/71/48/40714898b6927e5624f16bbc2ef285b6.jpg"
                style={{ height: "100vh", objectFit: "cover", width: "100%" }}
                alt=""
            />
            <div
                style={{
                    position: "absolute",
                    top: "100px",
                    left: "10vw",
                    backgroundColor: "white",
                    padding: "30px",
                    borderRadius: "10px",
                    width: "30%"
                }}
            >
                <div className="text-center text-gray" style={{ fontSize: "24px", fontWeight: "bold" }}>
                    {isRegister ? "Đăng kí" : "ĐĂNG NHẬP"}
                </div>
                <form >
                    {
                        isRegister && <div>
                            <div className="mb-3">
                                <Input type="text" name={"firstname"} value={payload.firstname} setValue={setPayload} placeholder={"Họ và tên đệm"} />
                            </div>
                            <div className="mb-3">
                                <Input type="text" name={"lastname"} value={payload.lastname} setValue={setPayload} placeholder={"Tên"} />
                            </div>
                        </div>
                    }
                    <div className="mb-3">
                        <Input type="text" name={"email"} value={payload.email} setValue={setPayload} placeholder={"Email"} />
                    </div>
                    <div className="mb-3">
                        <Input type="password" name={"password"} value={payload.password} setValue={setPayload} placeholder={"Password"} />
                    </div>
                    <Button name={isRegister ? "Đăng kí" : "Đăng nhập"} hanleOnclick={hanleSubmit} />
                </form>
                <div className="d-flex justify-content-between">
                    {isRegister ? <div></div> : <div>Quên mật khẩu</div>}
                    {isRegister ? (<><div onClick={() => { setRegister(false) }}>quay lại đăng nhập</div></>) : <>    <div onClick={() => { setRegister(true) }}>Tạo tài khoản mới</div></>}
                </div>
            </div>
        </div>


    </>
}

export default Login;