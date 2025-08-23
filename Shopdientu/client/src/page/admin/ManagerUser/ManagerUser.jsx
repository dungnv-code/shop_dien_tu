import { useState, useEffect, use } from 'react';
import { useSelector } from "react-redux";
import { GetAllUsers, UpdateUsers, DeleteUsers } from '../../../api/User';
import moment from 'moment';
import { MdDeleteForever } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { Input } from "../../../component";
import useDebone from "../../../ultils/useDebone";
import { PaginationCustom } from "../../../component/";
import { set, useForm } from "react-hook-form";
import Swal from 'sweetalert2';

const ManagerUser = () => {

    const [refresh, setRefresh] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [users, setUsers] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [userIndex, setUserIndex] = useState({
        uid: "",
        name: "",
        email: "",
        mobile: "",
        isBlocked: false,
        role: 1945
    });
    const [inputValue, setInputValue] = useState({
        search: ""
    });

    const limit = 3;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await GetAllUsers({ limit, page: currentPage });
                setUsers(response.userDatas || []);
                setTotalPages(response.totalPages || 1);

            } catch (error) {
            }
        }
        fetchUsers();
    }, [currentPage, refresh]);

    const debouncedSearchTerm = useDebone(inputValue.search, 500);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await GetAllUsers({ name: debouncedSearchTerm, limit, page: currentPage });
                setUsers(response.userDatas || []);
            } catch (error) {
            }
        }
        if (debouncedSearchTerm) {
            fetchUsers();
        } else {
            fetchUsers();
        }
    }, [debouncedSearchTerm]);

    const hanleSelectUser = (user) => {
        setUserIndex({
            uid: user?._id || "",
            name: user?.name || "",
            email: user?.email || "",
            mobile: user?.mobile || "",
            isBlocked: user?.isBlocked || false,
            role: user?.role || 1945
        });
    }

    const hanleSubmitEdit = async (e) => {
        e.preventDefault();
        const fetchUpdateUser = async () => {
            try {
                const { uid, ...data } = userIndex;
                const response = await UpdateUsers(data, uid);
                if (response.success === true) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Cập nhật thành công',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    setUserIndex({
                        name: "",
                        email: "",
                        mobile: "",
                        isBlocked: false,
                        role: 1945
                    });
                    setInputValue({ search: "" });
                    setCurrentPage(1);
                    setRefresh(prev => !prev);
                    const modal = bootstrap.Modal.getInstance(document.getElementById("formEdit"));
                    modal.hide();
                }
            } catch (error) {
                console.error("Error updating user:", error);
            }
        }
        fetchUpdateUser();
    }


    const hanleDeleteUser = async (uid) => {
        Swal.fire({
            title: 'Bạn có chắc chắn muốn xoá người dùng này?',
            text: "Bạn sẽ không thể khôi phục lại người dùng này!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xoá',
            cancelButtonText: 'Huỷ'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await DeleteUsers(uid);

                    if (response.success === true) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Xoá thành công',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        setInputValue({ search: "" });
                        setCurrentPage(1);
                        setRefresh(prev => !prev);
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Xoá thất bại',
                            text: response?.message || 'Có lỗi xảy ra khi xoá người dùng.',
                        });
                    }
                } catch (error) {
                    console.error("Error deleting user:", error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi',
                        text: error?.message || 'Đã xảy ra lỗi không xác định.',
                    });
                }
            }
        });
    }




    return (
        <div className="admin-layout p-3">
            <div className="modal" id="formEdit">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Sửa thông tin người dùng</h4>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <label htmlFor="name">Tên người dùng:</label>
                                <input type='text' name="name" className='form-control' onChange={(e) => { setUserIndex((prev) => { return { ...prev, "name": e.target.value } }) }} id='name' value={userIndex.name} placeholder='Tên người dùng'></input>
                                <label htmlFor="email">Email:</label>
                                <input type='email' name="email" className='form-control' id='email' onChange={(e) => { setUserIndex((prev) => { return { ...prev, "email": e.target.value } }) }} value={userIndex.email} placeholder='Email'></input>
                                <label htmlFor="mobile">Số điện thoại:</label>
                                <input type='mobile' name="mobile" className='form-control' id='mobile' value={userIndex.mobile} onChange={(e) => { setUserIndex((prev) => { return { ...prev, "mobile": e.target.value } }) }} placeholder='Số điện thoại'></input>
                                <label htmlFor="role">Quyền:</label>
                                <select name="role" className='form-control' id='role' value={userIndex.role} onChange={(e) => setUserIndex(prev => ({ ...prev, role: e.target.value }))}>
                                    <option value="1945">User</option>
                                    <option value="1975">Admin</option>
                                </select>
                                <label htmlFor="isBlocked">Trạng thái:</label>
                                <select name="isBlocked" className='form-control' id='isBlocked' value={userIndex.isBlocked} onChange={(e) => setUserIndex(prev => ({ ...prev, isBlocked: e.target.value }))}>
                                    <option value={false}>Đang hoạt động</option>
                                    <option value={true}>Đã khoá</option>
                                </select>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Huỷ</button>
                            <button type="button" className="btn btn-info" onClick={(e) => { hanleSubmitEdit(e) }}>Lưu</button>
                        </div>
                    </div>
                </div>
            </div>
            <h1>Quản lí người dùng </h1>
            <p>Tổng người dùng: {users.length}</p>
            <div>
                <Input
                    value={inputValue.search}
                    setValue={setInputValue}
                    name="search"
                    placeholder="Tìm kiếm người dùng"
                />
            </div>
            <div className="user-list">
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">STT</th>
                            <th scope="col">Họ và tên</th>
                            <th scope="col">Email</th>
                            <th scope="col">SĐT</th>
                            <th scope="col">Quyền</th>
                            <th scope="col">Tham gia</th>
                            <th scope="col">Trạng thái</th>
                            <th scope="col">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user?._id} className="user-item">
                                <th scope="row">{index + 1}</th>
                                <td>{user?.name}</td>
                                <td>{user?.email}</td>
                                <td>{user?.mobile}</td>
                                <td>{user?.role == "1945" ? "User" : "Admin"}</td>
                                <td>{moment(user?.createdAt).format("DD/MM/YYYY")}</td>
                                <td>{user?.isBlocked ? "Đã khoá" : "Đang hoạt động"}</td>
                                <td >
                                    <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#formEdit" onClick={() => hanleSelectUser(user)}>
                                        <CiEdit />
                                    </button>
                                    <button className="btn btn-danger" onClick={() => hanleDeleteUser(user?._id)}>
                                        <MdDeleteForever />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {
                    totalPages > 0 && <PaginationCustom currentPage={currentPage}
                        setCurrentPage={setCurrentPage} limit={limit} totalPages={totalPages} />
                }
            </div>
        </div>
    );
}
export default ManagerUser;