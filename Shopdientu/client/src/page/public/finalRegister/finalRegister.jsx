import "./FinalRegister.css"
import { useEffect } from "react";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";
import { path } from "../../../ultils/path";
const FinalRegister = () => {
    const { status } = useParams();
    const navigate = useNavigate();
    console.log(status)
    useEffect(() => {
        if (status == 0) {
            Swal.fire("Oop!", "Đăng kí không thành công", "error").then(() => {
                navigate(`/${path.LOGIN}`);
            })
        } else {
            Swal.fire("Thành cônng!", "Đăng kí thành công", "success").then(() => {
                navigate(`/${path.LOGIN}`);
            })
        }
    }, [])
    return <>
        <div>
            {/* <Navigate to={`/${path.LOGIN}`} state={status} /> */}
        </div>
    </>
}

export default FinalRegister;