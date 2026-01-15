import NavBar from "./NavBar";
import API from "../api/axios";
import { useState,useEffect } from "react";
import { Link} from "react-router-dom";


export default function Products(){
    const getProductsApi = async (params = {}) => {
        const res = await API.get("/products", { params });
        return res.data; 
    };

    const getProductBySlugApi = async (slug) => {
        const res = await api.get(`/products/slug/${slug}`);
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

    console.log(products)

    if (loading) return <p>Loading products...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div style={{ padding: "20px" }}>
            <div style={categoryBarStyle}>
                <button
                    onClick={() => loadProducts(1, null)}
                    style={!selectedCategory ? activeCategoryStyle : {}}
                >
                    All
                </button>

                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => loadProducts(1, cat.id)}
                        style={selectedCategory === cat.id ? activeCategoryStyle : {}}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            <h2>Products</h2>
            <div style={gridStyle}>
                {products.map((product) => (
                    
                    <div key={product.id} style={cardStyle}>
                    <p>{product.category.name}</p>
                        <img
                            src={product.image_url || "https://via.placeholder.com/200"}
                            alt={product.name}
                            style={imgStyle}
                        />

                        <h3>{product.name}</h3>
                        <p>₹ {product.price}</p>

                        <Link to={`/products/${product.slug}`}>View</Link>
                    </div>
                ))}
            </div>

            {pagination && (
                <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                    <button disabled={page === 1 }onClick={() => loadProducts(page - 1)}>
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
    );
}
const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
  gap: "20px",
};

const cardStyle = {
  border: "1px solid #ddd",
  padding: "10px",
  borderRadius: "5px",
};

const imgStyle = {
  width: "100%",
  height: "150px",
  objectFit: "cover",
};
const categoryBarStyle = {
  display: "flex",
  gap: "10px",
  marginBottom: "20px",
  flexWrap: "wrap"
};

const activeCategoryStyle = {
  fontWeight: "bold",
  textDecoration: "underline"
};
