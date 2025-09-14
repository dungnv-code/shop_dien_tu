import "./Blog.css"
import { HeaderBlog } from "../../../component";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

const Blog = () => {
    const [categori, setCategori] = useState("")

    return <>
        <div className="p-2">
            <HeaderBlog setCategori={setCategori} />
        </div>
        <div>
            <Outlet context={{ categori }} />
        </div>
    </>
}

export default Blog;