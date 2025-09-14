import { useSelector } from "react-redux";
import { Product } from "../../../component";
const WishList = () => {
    const { current } = useSelector((state) => state.user);

    console.log(current)
    return (
        <div className="member-layout">
            <h1>Danh sách yêu thích</h1>
            <hr />
            <div className="row p-2">
                {
                    current?.wishlist?.map((item, index) => {
                        return <div className="col-3 p-2">
                            <Product key={index} dataProduct={item} />
                        </div>
                    })
                }
            </div>
        </div>
    );
}

export default WishList;