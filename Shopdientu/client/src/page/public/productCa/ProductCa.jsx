import "./ProductCa.css"
import { useParams, useSearchParams, createSearchParams, useNavigate } from "react-router-dom";
import { Breadcrumbs, Product, FilterPro, InputSelect, PaginationCustom } from "../../../component";
import { getProducts } from "../../../api/Product";
import { useEffect, useState, useCallback } from "react";
import { getProductCategoryTitle } from "../../../api/Categori";

import Masonry from 'react-masonry-css'
const breakpointColumnsObj = {
    default: 5,
    1100: 3,
    700: 2,
    500: 1
};

const ProductCa = () => {

    const { category } = useParams();
    const [products, setProducts] = useState([]);
    const [actives, setActives] = useState(null);
    const [brand, setBrand] = useState([]);
    const [searchParams] = useSearchParams();
    const [sortSelect, setSelectSort] = useState("");
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const limit = 4;

    useEffect(() => {
        const fetchProducts = async (query = {}) => {
            const response = await getProducts({
                params: { category, ...query, limit: limit, page: currentPage }
            });
            const brand = await getProductCategoryTitle({ "title": category });
            if (Array.isArray(brand.reponse) && brand.reponse.length > 0) {
                const brands = brand.reponse[0].brand;
                setBrand(brands);
            }
            setProducts(response?.productDatas);
            setTotalPages(response?.totalPages);
        }

        const brands = searchParams.getAll("brand");
        const from = searchParams.getAll("from")[0];
        const to = searchParams.getAll("to")[0];
        const sort = searchParams.get("sort");
        const query = {
            ...(brands.length && { brand: brands.join(",") }),
            ...(from > 0 && { "price[gt]": from }),
            ...(to > 0 && { "price[lt]": to }),
            ...(sort && { sort })
        };
        fetchProducts(query);
    }, [category, searchParams, currentPage])

    const sortBy = [
        { label: "Mới nhất", value: "-createdAt" },
        { label: "Cũ nhất", value: "createdAt" },
        { label: "Giá cao", value: "-price" },
        { label: "Giá thấp", value: "price" },
        { label: "Đánh giá cao", value: "-totalRating" },
        { label: "Đánh giá thấp", value: "totalRating" },
        { label: "Tên A-Z", value: "title" },
        { label: "Tên Z-A", value: "-title" },
        { label: "Đã bán nhiều", value: "-sold" },
    ]

    const changeActive = useCallback((name) => {
        if (actives === name) {
            setActives(null);
        } else {
            setActives(name);
        }
    }, [actives])

    const handleSortChange = (e) => {
        setSelectSort(e.target.value);
    }

    useEffect(() => {
        navigate({
            pathname: `/${category}`,
            search: createSearchParams({
                sort: sortSelect
            }).toString()
        })
    }, [sortSelect])

    return <>
        <div style={{ padding: "20px 30px" }}>
            <h4>{category}</h4>
            <div className="m-2" style={{ borderBottom: "1px solid gray" }}>
                <Breadcrumbs categori={category} />
            </div>
            <div className="row" style={{ border: "1px solid gray" }}>
                <div className="col-9 m-2">
                    <div className="m-2"><b>Lọc theo</b></div>
                    <div className="d-flex gap-5">
                        <FilterPro name="Giá" actives={actives} type="input" changeActive={changeActive} />
                        <FilterPro name="Thương hiệu" actives={actives} data={brand} changeActive={changeActive} />
                    </div>
                </div>
                <div className="col-2 m-2">
                    <div className="m-2"><b>Sắp xếp theo</b></div>
                    <InputSelect value={sortSelect} options={sortBy} onChange={handleSortChange} />
                </div>
            </div>

            <div style={{ padding: "20px 10px" }}>
                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid_column"
                >
                    {products?.map((item, index) => {
                        return <div key={index}>
                            <Product dataProduct={item} />
                        </div>
                    })}
                </Masonry>
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
        </div>
    </>
}

export default ProductCa;