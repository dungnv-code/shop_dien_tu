import { getBlogCategorisAll } from "../../api/Blog";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./HeaderBlog.css";
import { path } from "../../ultils/path";
const HeaderBlog = ({ setCategori }) => {
    const [blogCategori, setBlogCategori] = useState([]);
    const [active, setActive] = useState(0);

    useEffect(() => {
        const fetchBlogCategori = async () => {
            const res = await getBlogCategorisAll();
            if (res.success) {
                setBlogCategori(res.data);
                setCategori(res.data[0]?.title || "");
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
                        to={path.BLOG}
                        key={index}
                        onClick={() => {
                            setActive(index);
                            setCategori(item.title);
                        }}
                        className={
                            active === index
                                ? "btn btn-primary m-1"
                                : "btn btn-outline-info m-1"
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
