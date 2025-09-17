import { useParams } from "react-router-dom";
import { getDetailBlog, likeBlog, dislikeBlog } from "../../api/Blog";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import "./BlogDetail.css";

const BlogDetail = () => {
    const { current } = useSelector((state) => state.user);
    const { bid } = useParams();

    const [blog, setBlog] = useState(null);
    const [userLiked, setUserLiked] = useState(false);
    const [userDisliked, setUserDisliked] = useState(false);

    // Hàm fetch blog và cập nhật trạng thái Like/Dislike
    const fetchBlogDetail = async () => {
        try {
            const res = await getDetailBlog(bid);
            if (res.mes === "Success") {
                setBlog(res.data);
                const likes = res.data?.likes || [];
                const dislikes = res.data?.dislikes || [];
                if (current?._id) {
                    setUserLiked(likes.some(user => user._id === current._id));
                    setUserDisliked(dislikes.some(user => user._id === current._id));
                }
            }
        } catch (error) {
            console.error("Error fetching blog:", error);
        }
    };

    // Fetch blog khi mount và khi current thay đổi
    useEffect(() => {
        fetchBlogDetail();
    }, [bid, current]);

    // Debug log khi trạng thái userLiked / userDisliked thay đổi
    useEffect(() => {
        console.log("userLiked changed:", userLiked);
        console.log("userDisliked changed:", userDisliked);
    }, [userLiked, userDisliked]);

    // Handle Like
    const handleLikeBlog = async () => {
        try {
            const res = await likeBlog(bid);
            if (res.mes === "Success" || res.mes === "Đã bỏ like") {
                await fetchBlogDetail();
            }
        } catch (error) {
            console.error("Error liking blog:", error);
        }
    };

    // Handle Dislike
    const handleDislikeBlog = async () => {
        try {
            const res = await dislikeBlog(bid);
            if (res.mes === "Success" || res.mes === "Đã bỏ dislike") {
                await fetchBlogDetail();
            }
        } catch (error) {
            console.error("Error disliking blog:", error);
        }
    };
    if (!blog) return <div>Đang tải...</div>;
    return (
        <div>
            <h1>{blog.title}</h1>
            <div
                className="blog-meta-row"
                style={{ fontSize: "14px", color: "#555", marginBottom: "20px" }}
            >
                <span className="blog-author">Đóng góp bởi {blog.author?.name}</span>
                <span className="blog-date p-2">
                    - {new Date(blog.createdAt).toLocaleDateString("vi-VN")}
                </span>
            </div>
            <div
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: blog.description }}
            ></div>
            <div className="d-flex gap-2 mt-3">
                <button
                    type="button"
                    className={`btn ${userLiked ? "btn-success" : "btn-primary"}`}
                    onClick={handleLikeBlog}
                >
                    <AiFillLike /> Like {blog.likes?.length || 0}
                </button>
                <button
                    type="button"
                    className={`btn ${userDisliked ? "btn-danger" : "btn-outline-info"}`}
                    onClick={handleDislikeBlog}
                // tuỳ chọn: không dislike nếu đã like
                >
                    <AiFillDislike /> Không hài lòng {blog.dislikes?.length || 0}
                </button>
            </div>
        </div>
    );
};

export default BlogDetail;
