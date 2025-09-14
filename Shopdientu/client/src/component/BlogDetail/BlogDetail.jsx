import { useParams } from "react-router-dom";
import { getDetailBlog } from "../../api/Blog";
import { useEffect, useState } from "react";
import "./BlogDetail.css"

const BlogDetail = () => {
    const { bid } = useParams();

    const [blog, setBlog] = useState(null);

    useEffect(() => {
        const fetchBlogDetail = async () => {
            const res = await getDetailBlog(bid);
            if (res.mes == "Success") {
                setBlog(res.data);
            }
        }
        fetchBlogDetail();
    }, [bid]);

    return <div>
        <h1>{blog?.title}</h1>
        <div className="blog-meta-row" style={{ fontSize: "14px", color: "#555", marginBottom: "20px" }}>
            <span className="blog-author">Đóng góp bởi {blog?.author?.name}</span>
            <span className="blog-date p-2">- {new Date(blog?.createdAt).toLocaleDateString("vi-VN")}</span>
        </div>
        <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: blog?.description }}
        ></div>

    </div >;
}

export default BlogDetail;