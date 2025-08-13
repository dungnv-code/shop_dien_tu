import styles from './Navbar.module.css';
import clsx from 'clsx';
import { useEffect, useState } from "react";
import { getCategoriProduct } from "../../api/Categori";
import { toSlug } from "../../ultils/helper";
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCategoris } from "../../redux/Slice/asyncActionProducts";
const Navbar = () => {

    const dispatch = useDispatch();
    const categoris = useSelector((state) => { return state.app.categoris });

    useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(getCategoris()).unwrap();
            } catch (error) {
                console.error("Lỗi khi lấy danh mục:", error);
            }
        };
        fetchData();
    }, []);


    return <>
        <div className="d-flex justify-content-center gap-4" style={{
            backgroundColor: "#ffd400", padding: "0 30px", fontSize: "20px",
        }}>
            {
                categoris?.map((item) => {
                    const slug = item.title;
                    return <NavLink key={item._id} to={slug} className={clsx("padding:0 10px", styles.hover_item)}>
                        {item.title}
                    </NavLink>
                })
            }
        </div >
    </>
}

export default Navbar;