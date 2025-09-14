import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllBlog } from "../../api/Blog";
import { Blogs } from "./../index";
const ContentBlog = () => {
    const { categori } = useOutletContext();
    const [blogs, setBlogs] = useState([]);
    useEffect(() => {
        console.log("Categori selected:", categori);
    }, [categori]);


    useEffect(() => {
        const fetchBlogs = async () => {
            const res = await getAllBlog({ param: { category: categori, status: "Đã duyệt" } });
            if (res.success) {
                setBlogs(res?.blogData);
            }
        };
        fetchBlogs();
    }, [categori]);

    return <div >
        <div className="row g-3">
            {
                blogs?.map((item, index) => (
                    <div className="col-3 p-2" key={index}>
                        <Blogs blog={item} />
                    </div>
                ))
            }

        </div>

    </div>;
}

export default ContentBlog;