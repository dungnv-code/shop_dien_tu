import { getOrderUser } from "../../../api/Oder"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { PaginationCustom } from "../../../component/";
const History = () => {
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
                    orderBy: current._id,
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
    }, [current?._id, limit, currentPage, status])

    return (
        <div className="member-layout">
            <h1>Lịch sử mua hàng</h1>
            <hr />
            <div className="d-flex justify-content-end me-3">
                <select onChange={(e) => {
                    if (e.target.value == "") {
                        setStatus(null)
                    } else {
                        setStatus(e.target.value)
                    }
                }} className="form-control" defaultValue="" style={{ width: "15%" }} >
                    <option value="Đã huỷ">Đã huỷ</option>
                    <option value="Đang xử lí">Đang xử lí</option>
                    <option value="Đã giao">Đã giao</option>
                    <option value="">Tất cả</option>
                </select>

            </div>
            <div className="p-3">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Stt</th>
                            <th>Sản phẩm</th>
                            <th>Trạng thái</th>
                            <th>Tổng giá</th>
                            <th>Ngày đặt</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderUser?.map((order, index) => (
                            <tr key={order._id}>
                                <td>{index + 1}</td>
                                <td>
                                    <ul>
                                        {order.products?.map((p) => (
                                            <li key={p._id}>
                                                {p.product?.title || p.product} -{" "}
                                                <b>{p?.size}</b>
                                                <b>{p?.color}</b>
                                                <b>{p.price?.toLocaleString()}đ</b>
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td>{order.status}</td>
                                <td>{order.total?.toLocaleString()}$</td>
                                <td>
                                    {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })}
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
    )
}

export default History
