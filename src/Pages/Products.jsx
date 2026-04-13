import NavBar from "./NavBar";
import API from "../api/axios";
import { useState,useEffect } from "react";
import { Link} from "react-router-dom";
import { useLocation } from "react-router-dom";
import '../CSS/Products.css'

export default function Products(){
    const getProductsApi = async (params = {}) => {
        const res = await API.get("/products/", { params });
        return res.data; 
    };

    const getCategoriesApi = async () => {
        const res = await API.get("/categories/");
        return res.data;
    };

    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const[sort,setSort] = useState("");

    const location = useLocation()
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get("search");

    const handleCategoryClick = (categoryId) => {
        setSelectedCategory(categoryId);
        loadProducts(1, categoryId, searchQuery, sort);
    };

    const loadProducts = async (pageNumber = 1, categoryId = selectedCategory,searchQuery = null,sortOption = sort) => {
        setLoading(true);
        try {
            const result = await getProductsApi({
                page: pageNumber,
                limit: 30,
                category_id: categoryId || undefined,
                search : searchQuery || undefined ,
                sort: sortOption || undefined
            });

            setProducts(result.data);
            setPagination(result.pagination);
            setPage(result.pagination.page);
            
        } catch{
            setError("Failed to load products");
        } finally {
            setLoading(false);
        }
    };
    console.log(import.meta.env.VITE_API_BASE_URL);


    useEffect(() => {
        setSelectedCategory(null);
        loadProducts(1, null, searchQuery, sort);
    }, [location.search]);

    useEffect(() => {
        const loadCategories = async () => {
            const data = await getCategoriesApi();
            setCategories(data);
        };
        loadCategories();
    }, []);

    if (loading) {
        return (
            <>
            <NavBar />
            <div className="status-container">
                <div className="loader"></div>
                <p className="status-text">Loading products...</p>
            </div>
            </>
        );
    }

    if (error) {
        return (
            <>
            <NavBar />
            <div className="status-container error">
                <p>⚠ {error}</p>
            </div>
            </>
        );
    }

    return (
        <>
            <NavBar/>
            {searchQuery && (
                <div className="search-info">
                    <p>
                    Showing results for <span>"{searchQuery}"</span>
                    </p>
                </div>
                )
            }
            <div className="products-page">
                <div className="category-bar">
                    <button
                        onClick={() => handleCategoryClick(null)}
                        className={!selectedCategory ? "active" : ""}
                    >
                        All
                    </button>

                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategoryClick(cat.id)}
                            className={selectedCategory === cat.id ? "active" : ""}>
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
                                src={product.image_url}
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
                        <button disabled={page === 1 } onClick={() => loadProducts(page - 1, selectedCategory, searchQuery, sort)}>
                            Prev
                        </button>

                        <span>
                            Page {pagination.page} of {pagination.total_pages}
                        </span>

                        <button disabled={page === pagination.total_pages} 
                            onClick={() => loadProducts(page + 1, selectedCategory, searchQuery, sort)}>
                            Next
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
