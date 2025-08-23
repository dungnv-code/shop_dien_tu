import { getProducts, UpdateProducts, DeleteProducts } from "../../../api/Product";
import { useState, useEffect } from "react";
import { PaginationCustom } from "../../../component/";
import "./ManagerProduct.css";
import { MdDeleteForever } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import useDebone from "../../../ultils/useDebone";
import { useSelector } from "react-redux";
import { Editor } from '@tinymce/tinymce-react';
import Swal from "sweetalert2";
import { data } from "react-router-dom";

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

    return (
        <div>
            {
                edit ?
                    (<>
                        <div className="p-3">
                            <h1>Sửa sản phẩm</h1>
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
                                    <button type="submit" className="btn btn-danger" onClick={() => { setEdit(false) }}>Huỷ</button>
                                    <button type="submit" className="btn btn-primary" onClick={(e) => { hanleSubmitEdit(e) }}>Sửa sản phẩm</button>
                                </div>
                            </form>
                        </div>
                    </>) :
                    (<>
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
                                                    <button className="btn btn-primary" onClick={() => { hanleEdit(item) }} >
                                                        <CiEdit />
                                                    </button>
                                                    <button className="btn btn-danger" onClick={() => { hanleDeleteProduct(item._id) }} >
                                                        <MdDeleteForever />
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

                    </>)
            }</div>
    );
}

export default ManagerProduct;