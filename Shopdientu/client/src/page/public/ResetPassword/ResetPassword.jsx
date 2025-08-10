import { useCallback, useState } from "react"
import "./ResetPassword.css"
import { useParams, useNavigate } from "react-router-dom";
import { ResetPasswordUser } from "../../../api/User";
import { path } from "../../../ultils/path";
import Swal from "sweetalert2";
const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const { token } = useParams();
    const navigate = useNavigate();

    const hanleResetPassword = useCallback(async (e) => {
        e.preventDefault();
        const data = await ResetPasswordUser({ password, token });
        if (data.success) {
            Swal.fire({
                icon: "success",
                title: "Lấy lại mật khẩu thành công!",
                confirmButtonText: "Đi đến đăng nhập"
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate(`/${path.LOGIN}`)
                }
            });
        }
    })

    return <>
        <div className="p-4">
            <div className="p-2">
                <label htmlFor="email">
                    Nhập vào mật khẩu mới của bạn:
                </label>
                <input type="password" name="password" className="form-control custom-input" value={password} onChange={(e) => { setPassword(e.target.value) }} placeholder="Enter your new password"></input>
            </div>
            <div className="text-end p-2">
                <button type="button" className="btn btn-info" onClick={(e) => { hanleResetPassword(e) }} style={{ marginRight: "10px" }}>Xác nhận</button>
            </div>
        </div>
    </>
}

export default ResetPassword;