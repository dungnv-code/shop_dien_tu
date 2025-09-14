import { getBlogCategorisAll } from "../../api/Blog";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./HeaderBlog.css";

const HeaderBlog = () => {
    const [blogCategori, setBlogCategori] = useState([]);
    const [active, setActive] = useState(0);

    useEffect(() => {
        const fetchBlogCategori = async () => {
            const res = await getBlogCategorisAll();
            if (res.success) {
                setBlogCategori(res.data);
            }
        };
        fetchBlogCategori();
    }, []);

    return (
        <div className="header-blog">
            <div>
                <span className="header-blog-title">
                    <b><i>Có thể bạn thích: </i></b>
                </span>
                {blogCategori.map((item, index) => (
                    <NavLink
                        key={index}
                        onClick={() => setActive(index)}
                        className={
                            active === index
                                ? "btn btn-primary m-1"
                                : "btn btn-outline-dark m-1"
                        }
                    >
                        {item.title}
                    </NavLink>
                ))}
            </div>
        </div>
    );
};

export default HeaderBlog;
