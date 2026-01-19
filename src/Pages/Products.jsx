import NavBar from "./NavBar";
import API from "../api/axios";
import { useState,useEffect } from "react";
import { Link} from "react-router-dom";
import '../CSS/Products.css'

export default function Products(){
    const getProductsApi = async (params = {}) => {
        const res = await API.get("/products", { params });
        return res.data; 
    };

    const getCategoriesApi = async () => {
        const res = await API.get("/categories");
        return res.data;
    };

    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);


    const loadProducts = async (pageNumber = 1, categoryId = selectedCategory) => {
        setLoading(true);
        try {
            const result = await getProductsApi({
                page: pageNumber,
                limit: 10,
                category_id: categoryId || undefined
            });

            setProducts(result.data);
            setPagination(result.pagination);
            setPage(result.pagination.page);
            setSelectedCategory(categoryId);

        } catch{
            setError("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts(1);
    }, []);

    useEffect(() => {
        const loadCategories = async () => {
            const data = await getCategoriesApi();
            setCategories(data);
        };
        loadCategories();
    }, []);

    if (loading) return <p>Loading products...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <>
            <NavBar/>
            <div className="products-page">
                <div className="category-bar">
                    <button
                        onClick={() => loadProducts(1, null)}
                        className={!selectedCategory ? "active" : ""}
                    >
                        All
                    </button>

                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => loadProducts(1, cat.id)}
                            className={selectedCategory === cat.id ? "active" : ""}                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                <h2 className="products-title">Products</h2>
                <div className="products-grid">
                    {products.map((product) => (
                        
                        <div key={product.id} className="product-card">
                        <p className="product-category">{product.category.name}</p>
                            <img
                                src={product.image_url || "https://via.placeholder.com/200"}
                                alt={product.name}
                            />

                            <h3>{product.name}</h3>
                            <p className="price">₹ {product.price}</p>

                            <Link to={`/products/${product.slug}`} className="view-btn">View</Link>
                        </div>
                    ))}
                </div>

                {pagination && (
                    <div className="pagination">
                        <button disabled={page === 1 } onClick={() => loadProducts(page - 1)}>
                            Prev
                        </button>

                        <span>
                            Page {pagination.page} of {pagination.total_pages}
                        </span>

                        <button disabled={page === pagination.total_pages} onClick={() => loadProducts(page + 1)}>
                            Next
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
