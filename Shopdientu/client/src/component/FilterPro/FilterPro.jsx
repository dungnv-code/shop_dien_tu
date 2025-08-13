import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

const FilterProduct = ({ name, actives, changeActive, type = "checkbox", data = [] }) => {
    const [select, setSelect] = useState([]);

    const hanleSelect = (el) => {
        setSelect(prev => {
            if (prev.includes(el)) {
                return prev.filter(item => item !== el);
            } else {
                return [...prev, el];
            }
        });
    }

    return <>
        <div style={{ position: "relative" }}>
            <div onClick={() => { changeActive(name) }} style={{ border: "1px solid gray", padding: "3px 15px" }}>{name} <IoIosArrowDown />
            </div>
            <div>
                {
                    actives == name && <div style={{ position: "absolute", padding: "10px", minWidth: "200px", zIndex: "800", backgroundColor: "white", height: "max-content", top: "100%", left: 0 }}>
                        {
                            type === "checkbox" ? <div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span>{`Chọn  ${select.length}`}</span>
                                    <button className="btn btn-danger">Làm mới</button>
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
                                Checkbox
                            </>
                        }
                    </div>
                }
            </div>
        </div >
    </>
}

export default FilterProduct;