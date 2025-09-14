import "./Blogs.css"
import { Link } from "react-router-dom";
import { path } from "../../ultils/path";
const Blogs = ({ blog }) => {
    return (
        <div className="blog-card">
            <div className="blog-image">
                <Link to={`${path.BLOG}/${blog?._id}`}>
                    <img src={blog?.image} alt="img" />
                </Link>
            </div>
            <div className="blog-body">
                <h6 className="blog-title">{blog?.title}</h6>
                <div className="blog-meta">Tác giả: {blog?.author?.name}</div>
                <div className="blog-meta">👁 {blog?.numberView} lượt xem</div>
            </div>
        </div >
    );

}

export default Blogs;