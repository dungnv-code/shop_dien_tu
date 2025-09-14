import { useState, useEffect } from "react";
import { getAllBlog, getBlogCategorisAll, CreateBlogCategoris, DeleteBlogUser, UpdateBlogUser } from "../../../api/Blog";
import { useSelector } from "react-redux";
import { IoIosAdd } from "react-icons/io";
import { Editor } from '@tinymce/tinymce-react';
import Swal from "sweetalert2";
import useDebounce from "../../../ultils/useDebone";
import { PaginationCustom } from "../../../component";
const BlogUser = () => {
    const { current } = useSelector((state) => state.user);
    const [blogs, setBlogs] = useState([]);
    const [iscreate, setIsCreate] = useState(false)
    const [blogcategoris, setBlogCategoris] = useState([])
    const [refresh, setRefresh] = useState(false)
    const status = ["Chờ xét duyệt", "Đã duyệt"]

    const [selectedInput, setSelectedInput] = useState("")
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);

    const limit = 5;
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1)

    const [inputdata, setInputdata] = useState({
        title: "",
        category: "#mẹo hay",
        description: "",
        image: "",
    })

    const DBselectedInput = useDebounce(selectedInput, 500)

    useEffect(() => {
        const fetchAllBlog = async () => {
            try {
                const param = {
                    limit,
                    page: currentPage,
                    author: current?._id,
                    title: selectedInput,
                    ...(selectedCategory != "" && { category: selectedCategory }),
                    ...(selectedStatus != "" && { status: selectedStatus }),
                }

                const [blogRes, blogCa] = await Promise.all([
                    getAllBlog({ param: param, }),
                    getBlogCategorisAll(),
                ]);

                if (blogRes?.success) {
                    setBlogs(blogRes.blogData);
                    setTotalPages(blogRes.totalPages || 1)
                }

                if (blogCa?.success) {
                    setBlogCategoris(blogCa.data)
                }
            } catch (error) {
                console.error("Lỗi khi tải blog:", error);
            }
        };
        fetchAllBlog()
    }, [refresh, DBselectedInput, limit, currentPage, selectedCategory, selectedStatus]);

    const validateInputData = () => {
        if (inputdata.title == "") {
            Swal.fire({
                icon: 'success',
                title: 'Tiêu đề không được để trống!',
                showConfirmButton: false,
                timer: 1500
            });
            return false
        }

        if (inputdata.description == "") {
            Swal.fire({
                icon: 'success',
                title: 'Nội dung bài viết không được để trống!',
                showConfirmButton: false,
                timer: 1500
            });
            return false
        }
        return true
    }

    const hanleCreateBlog = async (e) => {
        if (validateInputData()) {
            e.preventDefault()
            const formData = new FormData();
            formData.append("title", inputdata.title);
            formData.append("category", inputdata.category);
            formData.append("description", inputdata.description);
            formData.append("image", inputdata.image);
            const reponse = await CreateBlogCategoris(formData)
            if (reponse?.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Tạo bài viết thành công.',
                    showConfirmButton: false,
                    timer: 1500
                });
                setIsCreate(false)
                setInputdata({
                    title: "",
                    category: "#mẹo hay",
                    description: "",
                    image: "",
                })
                setPreview(null)
                setRefresh(!refresh)

            }
        }
    }

    const hanleDeleteBlogUser = async (id) => {
        const reponse = await DeleteBlogUser(id);
        if (reponse?.success) {
            Swal.fire({
                icon: 'success',
                title: 'Xoá bài viết thành công.',
                showConfirmButton: false,
                timer: 1500
            });
            setRefresh(!refresh)
        }
    }

    const [preview, setPreview] = useState(null)
    const [updateBlog, setUpdateBlog] = useState({})
    const [previewUP, setPreviewUp] = useState(null)

    const hanleUpdateBlog = async () => {
        const formData = new FormData();
        formData.append("title", updateBlog?.title);
        formData.append("category", updateBlog?.category);
        formData.append("description", updateBlog?.description);
        formData.append("image", updateBlog?.image);

        if (updateBlog.images instanceof File) {
            formData.append("images", updateBlog.images);
        } else if (typeof updateBlog.images === "string") {
            formData.append("images", updateBlog.images); // gửi link cũ
        }

        const reponse = await UpdateBlogUser(updateBlog?._id, formData)

        if (reponse.success) {
            Swal.fire({
                icon: 'success',
                title: 'Cập nhật bài viết thành công.',
                showConfirmButton: false,
                timer: 1500
            });
            const modalEl = document.getElementById("bloguser");
            const modal = bootstrap.Modal.getInstance(modalEl);
            modal.hide();
            setRefresh(!refresh)
        }
    }

    return (
        <div className="p-4">
            <div className="modal fade" id="bloguser" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Cập nhật bài viết</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={(e) => { hanleCreateBlog(e) }}>
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Tiêu đề</label>
                                    <input type="text" className="form-control" value={updateBlog?.title} id="title" onChange={(e) => { setUpdateBlog(() => { return { ...updateBlog, title: e.target.value } }) }} placeholder="Nhập vào tiêu đề"></input>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="exampleInputPassword1" className="form-label">Phân loại</label>
                                    <select className="form-control" value={updateBlog?.category} onChange={(e) => { setUpdateBlog(() => { return { ...updateBlog, category: e.target.value } }) }} defaultValue={blogcategoris?.[0]?.title}>
                                        {blogcategoris?.map((item, index) => (
                                            <option key={index} value={item.title}>
                                                {item.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label p-2">Nội dung bài viết</label>
                                    <Editor
                                        name="description"
                                        id="description"
                                        value={updateBlog?.description}
                                        onEditorChange={(newValue) =>
                                            setUpdateBlog((prev) => ({ ...prev, description: newValue }))
                                        }
                                        apiKey={import.meta.env.VITE_API_MAKE_DOWN}
                                        // onInit={(_evt, editor) => editorRef.current = editor}
                                        initialValue="<p>Bài viết ....</p>"
                                        init={{
                                            height: 500,
                                            menubar: true,
                                            plugins: [
                                                "advlist", "autolink", "lists", "link", "image", "charmap", "preview",
                                                "anchor", "searchreplace", "visualblocks", "code", "fullscreen",
                                                "insertdatetime", "media", "table", "code", "help", "wordcount"
                                            ],
                                            toolbar: "undo redo | blocks | " +
                                                "bold italic forecolor | alignleft aligncenter " +
                                                "alignright alignjustify | bullist numlist outdent indent | " +
                                                "removeformat | help",

                                            // 👇 ép ảnh tự full width
                                            content_style: `
    img { width: 100% !important; height: auto !important; }
  `,

                                            // 👇 Bỏ thuộc tính inline width/height khi user chèn ảnh
                                            image_dimensions: false,
                                            object_resizing: false,
                                        }}
                                    ></Editor>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="image" className="form-label">Ảnh bìa</label>
                                    <input type="file" className="form-control" id="image" onChange={(e) => {
                                        return setUpdateBlog(prev => {
                                            const url = URL.createObjectURL(e.target.files[0]);
                                            setPreviewUp(url);
                                            return { ...prev, image: e.target.files[0] };
                                        })
                                    }} placeholder="Nhập vào tiêu đề"></input>
                                </div>
                                {previewUP && (
                                    <div className="mt-2">
                                        <img
                                            src={previewUP}
                                            alt="previewUP"
                                            style={{ maxWidth: "200px", borderRadius: "8px" }}
                                        />
                                    </div>
                                )}
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                            <button type="button" className="btn btn-primary" onClick={() => { hanleUpdateBlog() }}>Cập nhật</button>
                        </div>
                    </div>
                </div>
            </div>
            {
                iscreate ? (<>
                    <div className="d-flex justify-content-between">
                        <h2 className="fw-bold mb-3 ">📚 Thêm bài viết</h2>
                        <button type="button" className="btn btn-primary" onClick={() => { setIsCreate(false) }}>Huỷ thêm</button>
                    </div>
                    <hr />
                    <div>
                        <form onSubmit={(e) => { hanleCreateBlog(e) }}>
                            <div className="mb-3">
                                <label htmlFor="title" className="form-label">Tiêu đề</label>
                                <input type="text" className="form-control" id="title" onChange={(e) => { setInputdata(() => { return { ...inputdata, title: e.target.value } }) }} placeholder="Nhập vào tiêu đề"></input>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="exampleInputPassword1" className="form-label">Phân loại</label>
                                <select className="form-control" onChange={(e) => { setInputdata(() => { return { ...inputdata, category: e.target.value } }) }} defaultValue={blogcategoris?.[0]?.title}>
                                    {blogcategoris?.map((item, index) => (
                                        <option key={index} value={item.title}>
                                            {item.title}
                                        </option>
                                    ))}
                                </select>

                            </div>
                            <div className="mb-3">
                                <label htmlFor="description" className="form-label p-2">Nội dung bài viết</label>
                                <Editor
                                    name="description"
                                    id="descriptions"
                                    onEditorChange={(newValue) =>
                                        setInputdata((prev) => ({ ...prev, description: newValue }))
                                    }
                                    apiKey={import.meta.env.VITE_API_MAKE_DOWN}
                                    // onInit={(_evt, editor) => editorRef.current = editor}
                                    initialValue="<p>Bài viết ....</p>"
                                    init={{
                                        height: 500,
                                        menubar: true,
                                        plugins: [
                                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                        ],
                                        toolbar: 'undo redo | blocks | ' +
                                            'bold italic forecolor | alignleft aligncenter ' +
                                            'alignright alignjustify | bullist numlist outdent indent | ' +
                                            'removeformat | help',
                                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                    }}
                                ></Editor>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="image" className="form-label">Ảnh bìa</label>
                                <input type="file" className="form-control" id="image" onChange={(e) => {
                                    return setInputdata(prev => {
                                        const url = URL.createObjectURL(e.target.files[0]);
                                        setPreview(url);
                                        return { ...prev, image: e.target.files[0] };
                                    })
                                }} placeholder="Nhập vào tiêu đề"></input>
                            </div>
                            {preview && (
                                <div className="mt-2">
                                    <img
                                        src={preview}
                                        alt="preview"
                                        style={{ maxWidth: "200px", borderRadius: "8px" }}
                                    />
                                </div>
                            )}
                            <div className="p-2">
                                <button type="submit" className="btn btn-primary">Tạo bài viết</button>
                            </div>
                        </form>
                    </div>
                </>) :
                    (<>   <h2 className="fw-bold mb-3 text-center">📚 Bài viết của bạn</h2>
                        <hr />
                        <div className="d-flex justify-content-between my-3">
                            <div>
                                <button className="btn btn-primary rounded-circle shadow" onClick={() => { setIsCreate(true) }} style={{ width: "50px", height: "50px" }}>
                                    <IoIosAdd size={24} />
                                </button>
                            </div>
                            <div className="d-flex gap-2">
                                <input type="text" className="form-control" value={selectedInput} onChange={(e) => { setSelectedInput(e.target.value) }} placeholder="Tiêu đề bài viết"></input>
                                <select
                                    className="form-control"
                                    value={selectedCategory ?? ""}
                                    onChange={(e) => setSelectedCategory(e.target.value || null)}
                                >
                                    <option value="">Tất cả</option>
                                    {blogcategoris?.map((item, index) => (
                                        <option key={index} value={item.title}>{item.title}</option>
                                    ))}
                                </select>
                                <select
                                    className="form-control"
                                    value={selectedStatus ?? ""}
                                    onChange={(e) => setSelectedStatus(e.target.value || null)}
                                >
                                    <option value="">Tất cả</option>
                                    {status?.map((item, index) => (
                                        <option key={index} value={item}>{item}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="table-responsive shadow-sm rounded">
                            <table className="table table-hover align-middle">
                                <thead className="table-dark text-center">
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Ảnh</th>
                                        <th scope="col">Tiêu đề</th>
                                        <th scope="col">Phân loại</th>
                                        <th scope="col">Trạng thái</th>
                                        <th scope="col">Ngày đăng</th>
                                        <th scope="col">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="text-center">
                                    {blogs?.length > 0 ? (
                                        blogs.map((item, index) => (
                                            <tr key={item._id || index}>
                                                <td>{(currentPage - 1) * limit + index + 1}</td>
                                                <td>
                                                    <img
                                                        src={item.image}
                                                        alt="blog"
                                                        className="img-thumbnail"
                                                        style={{
                                                            width: "80px",
                                                            height: "80px",
                                                            objectFit: "cover",
                                                            borderRadius: "8px",
                                                        }}
                                                    />
                                                </td>
                                                <td className="text-start">{item.title}</td>
                                                <td>
                                                    <span className="badge bg-info">{item.category}</span>
                                                </td>
                                                <td>
                                                    <span
                                                        className={`badge ${item.status === "Chờ xét duyệt"
                                                            ? "bg-warning text-dark"
                                                            : item.status === "Đã duyệt"
                                                                ? "bg-success"
                                                                : "bg-secondary"
                                                            }`}
                                                    >
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    {new Date(item.createdAt).toLocaleDateString("vi-VN", {
                                                        day: "2-digit",
                                                        month: "2-digit",
                                                        year: "numeric",
                                                    })}
                                                </td>
                                                <td>
                                                    <button className="btn btn-sm btn-outline-info m-1" data-bs-toggle="modal" data-bs-target="#bloguser" onClick={() => { setUpdateBlog(item); setPreviewUp(item?.image) }} >
                                                        Sửa bài viết
                                                    </button>
                                                    <button className="btn btn-sm btn-outline-danger" onClick={() => { hanleDeleteBlogUser(item._id) }} >
                                                        Xoá bài viết
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center text-muted py-4">
                                                🚫 Bạn chưa có bài viết nào
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            {totalPages > 0 && (
                                <PaginationCustom
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                    limit={limit}
                                    totalPages={totalPages}
                                />
                            )}
                        </div></>)
            }
        </div >
    );
};

export default BlogUser;
