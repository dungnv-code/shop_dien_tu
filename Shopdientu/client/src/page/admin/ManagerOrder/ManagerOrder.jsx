import { getOrderUser, updateStatusOrderUser } from "../../../api/Oder"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { PaginationCustom } from "../../../component"
import Swal from "sweetalert2";
const ManagerOrder = () => {

    const { current } = useSelector((state) => state.user)
    const [orderUser, setOrderUser] = useState([])

    const limit = 4;
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1)

    const [status, setStatus] = useState(null)

    const [refresh, setRefresh] = useState(false)



    useEffect(() => {
        if (!current?._id) return
        let isMounted = true
        const fetchOrderUser = async () => {
            try {
                const params = {

                    limit,
                    page: currentPage,
                    ...(status != null && { status }) // chỉ thêm khi status khác null/undefined
                }

                const response = await getOrderUser({ params })

                if (isMounted && response.success) {
                    setOrderUser(response.orderData)
                    setTotalPages(response.totalPages || 1)
                }
            } catch (error) {
                console.error("Lỗi khi fetch order:", error)
            }
        }
        fetchOrderUser()
        return () => { isMounted = false }
    }, [current?._id, limit, currentPage, status, refresh])

    const hanleUpdateStatusUser = async (id) => {
        const reponse = await updateStatusOrderUser(id, { status: "Đã giao" })
        if (reponse?.success) {
            Swal.fire({
                icon: "success",
                title: "Xác nhận giao hàng thành công",
                showConfirmButton: false,
                timer: 2000,
            });
            setRefresh(!refresh)
        }
    }

    return (
        <div className="history-wrapper">
            <h1 className="history-title">Quản lí lịch sử mua hàng</h1>
            <hr />
            <div className="d-flex justify-content-end me-3">
                <select
                    onChange={(e) => {
                        if (e.target.value == "") setStatus(null);
                        else setStatus(e.target.value);
                    }}
                    className="form-select history-filter"
                    defaultValue=""
                >
                    <option value="">Tất cả</option>
                    <option value="Đang xử lí">Đang xử lí</option>
                    <option value="Đã giao">Đã giao</option>
                    <option value="Đã huỷ">Đã huỷ</option>
                </select>
            </div>

            <div className="table-responsive p-3">
                <table className="table history-table align-middle">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Sản phẩm</th>
                            <th>Trạng thái</th>
                            <th>Tổng giá</th>
                            <th>Ngày đặt</th>
                            <th>Hoạt động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderUser?.map((order, index) => (
                            <tr key={order._id}>
                                <td>{(currentPage - 1) * limit + index + 1}</td>
                                <td>
                                    <ul className="product-list">
                                        {order.products?.map((p) => (
                                            <li key={p._id}>
                                                <span className="product-title">
                                                    {p.product?.title || p.product}
                                                </span>
                                                <span className="badge bg-light text-dark ms-2">
                                                    {p?.size}
                                                </span>
                                                <span className="badge bg-secondary ms-2">
                                                    {p?.color}
                                                </span>
                                                <span className="fw-bold text-primary ms-2">
                                                    {p.price?.toLocaleString()}đ
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td>
                                    <span
                                        className={`badge status-badge ${order.status === "Đã giao"
                                            ? "bg-success"
                                            : order.status === "Đang xử lí"
                                                ? "bg-warning text-dark"
                                                : "bg-danger"
                                            }`}
                                    >
                                        {order.status}
                                    </span>
                                </td>
                                <td className="fw-bold text-end text-primary">
                                    {order.total?.toLocaleString()}$
                                </td>
                                <td>
                                    {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </td>
                                <td>
                                    {(order?.status == "Đã giao" || order?.status == "Đã huỷ") ? <button className="btn btn-danger" disabled >Xác nhận giao hàng</button> : <button className="btn btn-danger" onClick={() => { hanleUpdateStatusUser(order?._id) }} >Xác nhận giao hàng</button>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {totalPages > 0 && (
                <PaginationCustom
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    limit={limit}
                    totalPages={totalPages}
                />
            )}
        </div>

    )
}

export default ManagerOrder;