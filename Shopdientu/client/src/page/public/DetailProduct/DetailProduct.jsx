import "./DetailProduct.css"
import { useParams } from "react-router-dom";

const DetailProduct = () => {

    const { pid, title } = useParams();
    return <>
        <div>
            PID: {pid}
        </div>
        <div>
            Title: {title}
        </div>
    </>
}

export default DetailProduct;