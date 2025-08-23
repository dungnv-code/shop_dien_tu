import { useSelector } from "react-redux"
import { useState, useEffect, useRef } from "react";
import { Quantity } from "../../../component";
import { createProducts } from "../../../api/Product";
import Swal from "sweetalert2";
import { Editor } from '@tinymce/tinymce-react';
const CreateProduct = () => {

    const category = useSelector(state => state.app.categoris)
    const [preview, setPreview] = useState(null);


    const [dataInput, setDatainput] = useState({
        title: "",
        price: 0,
        images: "",
        quantity: 0,
        category: "",
        brand: "",
        description: "",
    })
    const [brands, setBrands] = useState([]);
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

    const validate = (values) => {
        const errors = {};

        if (!values.title.trim()) {
            errors.title = "Tên sản phẩm không được để trống";
        }

        if (values.price <= 0) {
            errors.price = "Giá phải lớn hơn 0";
        }

        if (!values.images) {
            errors.images = "Ảnh không được để trống";
        }

        if (values.quantity < 0) {
            errors.quantity = "Số lượng không hợp lệ";
        }

        if (!values.category) {
            errors.category = "Vui lòng chọn danh mục";
        }

        if (!values.brand) {
            errors.brand = "Vui lòng chọn thương hiệu";
        }

        if (!values.description.trim()) {
            errors.description = "Mô tả không được để trống";
        }

        return errors;
    };


    useEffect(() => {
        if (category?.length > 0) {
            setBrands(category[0].brand);
            setDatainput(prev => ({ ...prev, category: category[0].title }));
        }
    }, [category]);


    const hanleSubmitCreateProduct = (e) => {
        e.preventDefault();
        const errors = validate(dataInput);

        if (Object.keys(errors).length > 0) {
            const errorMessages = Object.values(errors).join("\n"); // gộp lỗi thành chuỗi

            Swal.fire({
                icon: 'error',
                title: 'Lỗi nhập liệu',
                text: errorMessages || 'Có lỗi xảy ra.',
            });
        }


        const featchCreateProduct = async () => {
            const formData = new FormData();
            formData.append("title", dataInput.title);
            formData.append("price", dataInput.price);
            formData.append("quantity", dataInput.quantity);
            formData.append("category", dataInput.category);
            formData.append("brand", dataInput.brand);
            formData.append("description", dataInput.description);
            formData.append("images", dataInput.images);

            const createPro = await createProducts(formData);
            if (createPro.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Tạo thành công',
                    showConfirmButton: false,
                    timer: 1500
                });
                setPreview(null);
                setDatainput({
                    title: "",
                    price: 0,
                    images: "",
                    quantity: 0,
                    category: "",
                    brand: "",
                    description: "",
                })
            }

        }
        featchCreateProduct();
    }


    return (
        <div className="admin-layout p-3">
            <h1>Tạo sản phẩm mới</h1>
            <hr />
            <div>
                <form>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Tên sản phẩm</label>
                        <input type="text" id="title" className="form-control" onChange={(e) => { return setDatainput(prev => { return { ...prev, title: e.target.value } }) }} name="name" required />
                    </div>
                    <div className="mb-3 d-flex align-items-center">
                        <label className="form-label p-2">Giá</label>
                        <input type="number" className="form-control" id="price" name="price" onChange={(e) => { return setDatainput(prev => { return { ...prev, price: e.target.value } }) }} required min="0" />
                        <label htmlFor="quantity" className="form-label p-2">Số lượng</label>
                        <input type="text" className="form-control" onChange={(e) => { return setDatainput(prev => { return { ...prev, quantity: e.target.value } }) }} id="quantity" name="quantity" required min="0" />
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
                    <button type="submit" className="btn btn-primary" onClick={(e) => { hanleSubmitCreateProduct(e) }} >Thêm sản phẩm</button>
                </form>
            </div >
        </div >
    );
}

export default CreateProduct;