import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { UpdatebyUsers } from "../../../api/User";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { getCurrent } from "../../../redux/userSlice/asyncActionUser";
const Personal = () => {

    const { current } = useSelector(state => state.user);
    const [refresh, setRefresh] = useState(false);
    const [preview, setPreview] = useState(null);
    const dispatch = useDispatch();

    const [info, setInfo] = useState({
        name: "",
        email: "",
        mobile: "",
        address: "",
        image: ""
    });

    const isDirty =
        info.name !== current.name ||
        info.email !== current.email ||
        info.mobile !== current.mobile ||
        info.address !== current.address
    // || (info.image && info.image instanceof File);

    useEffect(() => {
        dispatch(getCurrent())
    }, [refresh])

    useEffect(() => {
        setInfo({
            name: current?.name,
            email: current?.email,
            mobile: current?.mobile,
            address: current?.address
        })
        setPreview(current?.image)
    }, [current])

    const hanleSubmitForm = (e) => {
        e.preventDefault()
        const formData = new FormData();
        formData.append("name", info.name);
        formData.append("email", info.email);
        formData.append("mobile", info.mobile);
        formData.append("address", info.address);

        if (info.image instanceof File) {
            formData.append("image", info.image);
        }
        const fetchUpdateByUser = async () => {
            const data = await UpdatebyUsers(formData);
            if (data.success) {
                Swal.fire({
                    icon: "success",
                    title: "Cập nhật thành công",
                    showConfirmButton: false,
                    timer: 2000,
                });
                setRefresh(!refresh)
            }
        }
        fetchUpdateByUser()
    }

    return (
        <div className="member-layout p-4">
            <h1>Cập nhật thông tin cá nhân</h1>
            <hr />
            <div className="d-flex justify-content-center">
                <div className="w-75">
                    <form onSubmit={(e) => { hanleSubmitForm(e) }}>
                        <div className="mb-3">
                            <label htmlFor="name">Họ và tên</label>
                            <input type="text" className="form-control" value={info.name} onChange={(e) => { setInfo(prev => { return { ...prev, name: e.target.value } }) }} id="name" name="name" ></input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email">Email</label>
                            <input type="text" className="form-control" value={info.email} onChange={(e) => { setInfo(prev => { return { ...prev, email: e.target.value } }) }} id="email" name="email" ></input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="mobile">Số điện thoại</label>
                            <input type="text" className="form-control" value={info.mobile} id="mobile" onChange={(e) => { setInfo(prev => { return { ...prev, mobile: e.target.value } }) }} name="mobile" ></input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="address">Địa chỉ</label>
                            <input type="text" className="form-control" value={info.address} id="address" onChange={(e) => { setInfo(prev => { return { ...prev, address: e.target.value } }) }} name="address" ></input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="image">Ảnh</label>
                            <input type="file" className="form-control" id="image" onChange={(e) => { setInfo(prev => ({ ...prev, image: e.target.files[0] })); setPreview(URL.createObjectURL(e.target.files[0])) }} name="image" ></input>
                        </div>
                        {
                            preview !== "" ? (<>
                                <img src={preview} alt="anh" style={{ width: "300px", height: "200px" }}></img>
                            </>) : (<></>)
                        }
                        <div className="">
                            Trạng thái: {current.isBlocked ? "đã bị khoá" : "đang hoạt động"}
                        </div>
                        <div className="">
                            Quyền: {current.role == "1945" ? "người dùng" : "quản lí"}
                        </div>

                        <div className="">
                            Tham gia: {new Date(current.createdAt).toLocaleDateString("vi-VN", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                            })}
                        </div>
                        <div className="mb-3 m-2 text-end">
                            <button type="submit" className="btn btn-danger" style={{ display: !isDirty ? "none" : "flex" }} >Cập nhập</button>
                        </div>
                    </form>
                </div>
            </div >
        </div >
    );
}

export default Personal;