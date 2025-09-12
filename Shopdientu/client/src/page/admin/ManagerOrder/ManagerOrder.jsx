import { getOrderUser } from "../../../api/Oder";
import { useState, useEffect } from "react";
const ManagerOrder = () => {

    const [orderUser, setOrderUser] = useState([])

    useEffect(() => {
        const fetchOrderUser = async () => {
            const reponse = await getOrderUser()
            if (reponse.mes = "Success") {
                setOrderUser(reponse?.data)
            }
        }
        fetchOrderUser()
    }, [])

    useEffect(() => {
        console.log(orderUser)
    }, [orderUser])

    return (
        <div className="admin-layout">
            <h1>ManagerOrder </h1>
            {/* Add your admin components here */}
        </div>
    );
}

export default ManagerOrder;