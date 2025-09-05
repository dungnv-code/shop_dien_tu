import { getProducts, UpdateProducts, DeleteProducts, getVariant, addVariant, deleteVariant } from "../../../api/Product";
import { useState, useEffect } from "react";
import { PaginationCustom } from "../../../component/";
import "./ManagerProduct.css";
import { MdDeleteForever } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { MdGridView } from "react-icons/md";
import useDebone from "../../../ultils/useDebone";
import { useSelector } from "react-redux";
import { Editor } from '@tinymce/tinymce-react';
import Swal from "sweetalert2";


const ManagerProduct = () => {
    const category = useSelector(state => state.app.categoris)
    const [products, setProduct] = useState([]);
    const limit = 10;
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1)
    const [refresh, setRefresh] = useState(false);
    const [inputSearch, setInputValueSearch] = useState("");
    const debouncedSearchTerm = useDebone(inputSearch, 500);
    const [edit, setEdit] = useState(false);
    const [brands, setBrands] = useState([]);

    const [preview, setPreview] = useState(null);

    const [isvariant, setIsvariant] = useState(false);

    const [dataInput, setDatainput] = useState({
        _id: "",
        title: "",
        price: 0,
        images: "",
        quantity: 0,
        category: "",
        brand: "",
        description: "",
    })


    useEffect(() => {
        if (category?.length > 0) {
            setBrands(category[0].brand);
            setDatainput(prev => ({ ...prev, category: category[0].title }));
        }
    }, [category]);

    useEffect(() => {
        const featchProduct = async () => {
            const reponsive = await getProducts({
                params: { limit: 10, page: currentPage, title: debouncedSearchTerm }
            });
            setProduct(reponsive.productDatas || []);
            setTotalPages(reponsive.totalPages || 1);
        }
        featchProduct();
    }, [currentPage, refresh, debouncedSearchTerm])

    const OnchangeSelectCategori = (index, value) => {
        const newBrands = category[index].brand;
        setBrands(newBrands);
        // Set category và reset brand về option đầu tiên
        setDatainput((prev) => ({
            ...prev,
            category: value,
            brand: newBrands.length > 0 ? newBrands[0] : ""   // reset brand về brand[0]
        }));
    };

    const hanleEdit = (item) => {
        setEdit(true);
        setDatainput({
            _id: item?._id,
            title: item?.title,
            price: item?.price,
            images: item?.image,
            quantity: item?.quantity,
            category: item?.category,
            brand: item?.brand,
            description: item?.description,
        });
        setPreview(item?.image)
    }

    const hanleSubmitEdit = (e) => {
        e.preventDefault();
        const featchUpdate = async () => {
            const { _id, ...data } = dataInput;
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("price", data.price);
            formData.append("quantity", data.quantity);
            formData.append("category", data.category);
            formData.append("brand", data.brand);
            formData.append("description", data.description);
            if (data.images instanceof File) {
                formData.append("images", data.images);
            } else if (typeof data.images === "string") {
                formData.append("images", data.images); // gửi link cũ
            }
            const update = await UpdateProducts(formData, _id);
            if (update.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Sửa thành công',
                    showConfirmButton: false,
                    timer: 2000
                });
            }
            setRefresh(!refresh);
            setEdit(false);
        }
        featchUpdate();
    }

    const hanleDeleteProduct = (id) => {
        const featchDelePro = async () => {
            try {
                const repon = await DeleteProducts(id);
                if (repon.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Xoá thành công',
                        showConfirmButton: false,
                        timer: 2000
                    });
                    setRefresh(!refresh);
                }
            } catch (err) {
                console.log(err);
            }
        }
        featchDelePro();
    }


    // variant 

    const [variant, setVariant] = useState({
        price: "",
        color: "",
        size: "",
        images: "",
    })

    const [preVariant, setPreVariant] = useState("");

    const hanleAddVariant = (e) => {
        e.preventDefault()
        const FeatchAddVariant = async () => {
            try {
                const formData = new FormData();
                formData.append("pid", pid);
                formData.append("price", variant.price);
                formData.append("color", variant.color);
                formData.append("size", variant.size);

                if (variant.images) {
                    formData.append("images", variant.images);
                }
                const data = await addVariant(formData);
                if (data) {
                    Swal.fire({
                        icon: "success",
                        title: data?.message,
                        showConfirmButton: false,
                        timer: 2000,
                    });
                    setRefresh(!refresh);
                    setVariant({
                        price: "",
                        color: "",
                        size: "",
                        images: "",
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Có lỗi xảy ra",
                    text: error.message,
                });
            }
        };
        FeatchAddVariant();
    }

    const [listVa, setListVa] = useState([]);

    const [pid, setPid] = useState(null);

    useEffect(() => {
        if (pid) {
            const featchGetVariant = async () => {
                const data = await getVariant(pid);
                setListVa(data?.dataVariant || [])
            }
            featchGetVariant();
        }
    }, [pid, refresh])

    const handleDeleteVariant = (vid) => {
        const fetchDeleteVariant = async () => {
            try {
                const data = await deleteVariant({ pid, vid });
                if (data) {
                    Swal.fire({
                        icon: "success",
                        title: data?.message,
                        showConfirmButton: false,
                        timer: 2000,
                    });
                    setRefresh(!refresh);
                }
            } catch (err) {
                Swal.fire({
                    icon: "error",
                    title: "Có lỗi xảy ra",
                    text: err.message,
                });
            }
        }

        fetchDeleteVariant();
    }

    return (
        <div style={{ position: "relative", display: "flex", flexDirection: "column", }}>
            {
                edit && <div style={{ backgroundColor: "white", position: "absolute", top: "0", bottom: "0", right: "0", left: "0" }}>
                    <>
                        <div className="p-3">
                            <div className="d-flex justify-content-between w-100">
                                <h1>Sửa sản phẩm</h1>
                                <button type="submit" className="btn btn-danger" onClick={() => { setEdit(false) }}>Huỷ</button>
                            </div>
                            <hr />
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Tên sản phẩm</label>
                                    <input type="text" id="title" value={dataInput.title} className="form-control" onChange={(e) => { return setDatainput(prev => { return { ...prev, title: e.target.value } }) }} name="name" required />
                                </div>
                                <div className="mb-3 d-flex align-items-center">
                                    <label className="form-label p-2">Giá</label>
                                    <input type="number" className="form-control" id="price" name="price" value={dataInput.price} onChange={(e) => { return setDatainput(prev => { return { ...prev, price: e.target.value } }) }} required min="0" />
                                    <label htmlFor="quantity" className="form-label p-2">Số lượng</label>
                                    <input type="text" className="form-control" value={dataInput.quantity} onChange={(e) => { return setDatainput(prev => { return { ...prev, quantity: e.target.value } }) }} id="quantity" name="quantity" required min="0" />
                                    <label htmlFor="category" className="form-label p-2">Loại</label>
                                    <select
                                        id="category"
                                        name="category"
                                        value={dataInput.category}
                                        onChange={(e) => {
                                            const idx = parseInt(e.target.selectedOptions[0].getAttribute("data-idx"));
                                            const value = e.target.value;
                                            OnchangeSelectCategori(idx, value);
                                        }}
                                        className="form-control"
                                    >
                                        {category?.map((item, idx) => (
                                            <option key={idx} data-idx={idx} value={item.title}>
                                                {item.title}
                                            </option>
                                        ))}
                                    </select>

                                    <label htmlFor="brand" className="form-label p-2">Thương hiệu</label>
                                    <select
                                        id="brand"
                                        name="brand"
                                        value={dataInput.brand}   // 👈 auto bám theo state
                                        onChange={(e) =>
                                            setDatainput((prev) => ({ ...prev, brand: e.target.value }))
                                        }
                                        className="form-control"
                                    >
                                        {brands?.map((item, idx) => (
                                            <option key={idx} value={item}>
                                                {item}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="description" className="form-label p-2">Mô tả</label>
                                    <Editor
                                        name="description"
                                        value={dataInput.description}
                                        id="description"
                                        onEditorChange={(newValue) =>
                                            setDatainput((prev) => ({ ...prev, description: newValue }))
                                        }
                                        apiKey={import.meta.env.VITE_API_MAKE_DOWN}
                                        // onInit={(_evt, editor) => editorRef.current = editor}
                                        initialValue="<p>This is the initial content of the editor.</p>"
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
                                    <label className="form-label">Hình ảnh</label>
                                    <input type="file" onChange={(e) => {
                                        return setDatainput(prev => {
                                            const url = URL.createObjectURL(e.target.files[0]);
                                            setPreview(url);
                                            return { ...prev, images: e.target.files[0] };
                                        })
                                    }} className="form-control" name="images" accept="image/*" />
                                    {preview && (
                                        <div className="mt-2">
                                            <img
                                                src={preview}
                                                alt="preview"
                                                style={{ maxWidth: "200px", borderRadius: "8px" }}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="d-flex gap-2">
                                    <button type="submit" className="btn btn-primary" onClick={(e) => { hanleSubmitEdit(e) }}>Sửa sản phẩm</button>
                                </div>
                            </form>
                        </div>
                    </>
                </div>
            }
            {
                isvariant && <div style={{ backgroundColor: "white", position: "absolute", top: "0", bottom: "0", right: "0", left: "0" }}>
                    <>
                        <div className="p-3">
                            <div className="d-flex justify-content-between w-100">
                                <h1>Thêm biến thể sản phẩm</h1>
                                <button type="submit" className="btn btn-danger" onClick={() => { setIsvariant(false) }}>Huỷ</button>
                            </div>

                            <form className="p-4">
                                <div className="d-flex gap-3">
                                    <div className="mb-3">
                                        <label htmlFor="price" className="form-label">Giá</label>
                                        <input type="text" id="price" value={variant.price} className="form-control" onChange={(e) => { return setVariant(prev => { return { ...prev, price: e.target.value } }) }} name="price" required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="color" className="form-label">Màu</label>
                                        <input type="text" id="color" value={variant.color} className="form-control" onChange={(e) => { return setVariant(prev => { return { ...prev, color: e.target.value } }) }} name="color" required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="size" className="form-label">Kíck thước</label>
                                        <input type="text" id="size" value={variant.size} className="form-control" onChange={(e) => { return setVariant(prev => { return { ...prev, size: e.target.value } }) }} name="size" required />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="images" className="form-label">Ảnh</label>

                                    <input
                                        type="file"
                                        id="images"
                                        className="form-control"
                                        onChange={(e) => {
                                            const file = e.target.files[0]; // lấy file đầu tiên
                                            if (file) {
                                                setPreVariant(URL.createObjectURL(file)); // tạo link preview
                                                setVariant(prev => ({ ...prev, images: file })); // lưu file, không dùng e.target.value
                                            }
                                        }}
                                        name="images"
                                        required
                                    />

                                    {preVariant && (
                                        <div className="mt-2">
                                            <img
                                                src={preVariant}
                                                alt="preview"
                                                style={{ maxWidth: "200px", borderRadius: "8px" }}
                                            />
                                        </div>
                                    )}
                                </div>
                                <button className="btn btn-primary" onClick={(e) => { hanleAddVariant(e) }}>Thêm biến thể</button>
                            </form>
                            <div>
                                {
                                    listVa.length > 0 ? (
                                        <>
                                            <h1>Biến thể sản phẩm</h1>
                                            <table className="table" style={{ margin: "10px 0", width: "100%" }}>
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Ảnh</th>
                                                        <th scope="col">Giá</th>
                                                        <th scope="col">Màu</th>
                                                        <th scope="col">Kích thước</th>
                                                        <th scope="col">Hoạt động</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {listVa.map((item, index) => (
                                                        <tr key={index}>
                                                            <td>
                                                                <img
                                                                    src={item.image}
                                                                    alt={`variant-${index}`}
                                                                    style={{ width: "150px", borderRadius: "8px" }}
                                                                />
                                                            </td>
                                                            <td>{item.price.toLocaleString()} ₫</td>
                                                            <td>{item.color}</td>
                                                            <td>{item.size}</td>
                                                            <td>
                                                                <button className="btn btn-danger" onClick={() => { handleDeleteVariant(item._id) }} >
                                                                    <MdDeleteForever />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </>
                                    ) : (
                                        <h1>Chưa Có biến thể</h1>
                                    )
                                }
                            </div>

                        </div>
                    </>
                </div >
            }
            <div className="admin-layout p-3">
                <h1>Quản lí sản phẩm</h1>
                <hr />

                <div className="m-2">
                    <input
                        value={inputSearch}
                        type="text"
                        className="form-control"
                        placeholder="tìm kiếm sản phẩm"
                        onChange={(e) => { setInputValueSearch(e.target.value) }}
                    />
                </div>

                <div className="table-responsive">
                    <table className="table table-bordered table-hover align-middle table-custom">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Ảnh</th>
                                <th>Tên</th>
                                <th>T.hiệu</th>
                                <th>Loại</th>
                                <th>Giá</th>
                                <th>Số lượng</th>
                                <th>Đã bán</th>
                                <th>Đ.Giá</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products?.map((item, index) => (
                                <tr key={index}>
                                    <td>{(currentPage - 1) * limit + (index + 1)}</td>
                                    <td style={{ maxWidth: "100px" }}>
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="img-fluid rounded shadow-sm"
                                        />
                                    </td>
                                    <td className="line_wrap">{item.title}</td>
                                    <td>{item.brand}</td>
                                    <td>{item.category}</td>
                                    <td className="text-end">{item.price.toLocaleString()} ₫</td>
                                    <td className="text-center">{item.quantity}</td>
                                    <td className="text-center">{item.sold}</td>
                                    <td className="text-center">{item.totalRating}</td>
                                    <td>
                                        <button className="btn btn-primary" onClick={() => { hanleEdit((item)) }} >
                                            <CiEdit />
                                        </button>
                                        <button className="btn btn-danger" onClick={() => { hanleDeleteProduct(item._id) }} >
                                            <MdDeleteForever />
                                        </button>
                                        <button className="btn btn-warning" onClick={() => { setPid(item._id); return setIsvariant(true) }} >
                                            <MdGridView />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {
                    totalPages > 0 && (
                        <PaginationCustom
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            limit={limit}
                            totalPages={totalPages}
                        />
                    )
                }
            </div >



        </div >
    );
}

export default ManagerProduct;