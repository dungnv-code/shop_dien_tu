import { useEffect, useState, useTransition } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { createSearchParams, useNavigate, useParams } from "react-router-dom"
import { getProducts } from "../../api/Product";
const FilterProduct = ({ name, actives, changeActive, type = "checkbox", data = [] }) => {

    const [select, setSelect] = useState([]);

    const navigate = useNavigate();
    const [bestPrice, setBestPrice] = useState(0);
    const { category } = useParams();
    const [isPending, startTransition] = useTransition();
    const [price, setPrice] = useState({
        from: "",
        to: ""
    });

    const hanleSelect = (el) => {
        setSelect(prev => {
            if (prev.includes(el)) {
                return prev.filter(item => item !== el);
            } else {
                return [...prev, el];
            }
        });
    }

    useEffect(() => {
        const fetchBestPrice = async () => {
            const response = await getProducts({
                params: { category, limit: 1, sort: "-price" }
            });
            if (response?.productDatas && response.productDatas.length > 0) {
                setBestPrice(response.productDatas[0].price);
            } else {
                setBestPrice(0);
            }
        }
        fetchBestPrice();
    }, [category])

    const hanlePriceChange = (e) => {
        const { id, value } = e.target;
        setPrice(prev => ({
            ...prev,
            [id]: Number(value)
        }));
    }

    useEffect(() => {
        if (price.from > price.to) {
            alert("Giá từ không thể lớn hơn giá đến");
        }
    }, [price])

    useEffect(() => {
        startTransition(() => {
            const data = {};
            // price filter
            if (price.from > 0) data.from = price.from;
            if (price.to > 0) data.to = price.to;

            if (select && select.length > 0) data.brand = select;

            navigate({
                pathname: `/${category}`,
                search: createSearchParams(data).toString(),
            });
        });
    }, [price, select, category, navigate]);

    return <>
        <div style={{ position: "relative" }}>
            <div onClick={() => { changeActive(name) }} style={{ border: "1px solid gray", padding: "3px 15px" }}>{name} <IoIosArrowDown />
            </div>
            <div>
                {
                    actives == name && <div style={{ position: "absolute", padding: "10px", border: "1px solid gray", minWidth: "200px", zIndex: "800", backgroundColor: "white", height: "max-content", top: "100%", left: 0 }}>
                        {
                            type === "checkbox" ? <div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span>{`Chọn  ${select.length}`}</span>
                                    <button onClick={() => { setSelect([]) }} className="btn btn-danger">Làm mới</button>
                                </div>
                                {
                                    data.map((item, index) => {
                                        return <div key={index} className="">
                                            <input type="checkbox" checked={select.includes(item)} onClick={() => { hanleSelect(item) }} id={item} name={item} ></input>
                                            <span>{item}</span>
                                        </div>
                                    })
                                }
                            </div> : <>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span>{`Giá cao nhất là ${bestPrice?.toLocaleString()}đ`}</span>
                                    <button onClick={() => { setPrice({ to: "", from: "" }) }} className="btn btn-danger">Làm mới</button>
                                </div>
                                <div className="d-flex align-items-center gap-2 m-2" style={{ minWidth: "400px" }}>
                                    <div className="d-flex align-items-center gap-2 m-2">
                                        <label>
                                            Từ
                                        </label>
                                        <input type="number" id="from" onChange={(e) => { hanlePriceChange(e) }} value={price.from} className="form-control" />
                                    </div>
                                    <div className="d-flex align-items-center gap-2 m-2">
                                        <label>
                                            Đến
                                        </label>
                                        <input type="number" id="to" onChange={(e) => { hanlePriceChange(e) }} value={price.to} className="form-control" />
                                    </div>
                                </div>
                            </>
                        }
                    </div>
                }
            </div>
        </div >
    </>
}

export default FilterProduct;