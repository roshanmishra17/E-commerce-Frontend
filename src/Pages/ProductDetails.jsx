import { useState,useEffect } from "react";
import { useNavigate,useParams } from "react-router-dom";
import API from "../api/axios";
import NavBar from "./NavBar";
import '../CSS/ProductDetails.css'

export default function ProductDetails(){
      
    const [product, setProduct] = useState(null);
    const [error, setError] = useState("");
    const { slug } = useParams();
    const navigate = useNavigate();
    const [adding, setAdding] = useState(false);


    const getProductBySlugApi = async (slug) => {
        const res = await API.get(`/products/slug/${slug}`);
        return res.data;
    };

    const addToCartApi = async (productId, quantity = 1) => {
        const res = await API.post("/cart", {
            product_id: productId,
            quantity: quantity,
        });

        return res.data;
    };

    const isAuth = () => {
        return !!localStorage.getItem("token");
    }

    useEffect(() => {
        const load = async () => {
            try{
                const data = await getProductBySlugApi(slug)
                setProduct(data)
            }catch{
               setError("Product not found") 
            }
        }
        load();
    },[slug])

    const handleAddToCart = async () => {

        if(!isAuth()){
            navigate("/login");
            return;
        }

        try {
            setAdding(true);
            await addToCartApi(product.id, 1);
            navigate("/cart");
        } catch {
            alert("Failed to add to cart");
        }finally{
            setAdding(false)
        }
    }
    if (error) return <p className="error">{error}</p>
    if (!product) return <p className="loading">Loading...</p>

    return(
        <>
            <NavBar/>
            <div className="product-details-page">
                <div className="product-details-container">
                    <div className="product-image">
                        <img
                            src={product.image_url}
                            alt={product.name}
                        />
                    </div>
                    <div className="product-info">
                        <h2>{product.name}</h2>
                        <p className="category">Category: {product.category?.name}</p>
                        <p className="price">₹ {product.price}</p>
                        <p className="description">{product.description}</p>


                        <button className="add-to-cart-btn" onClick={handleAddToCart} disabled={adding}>
                            {adding ? "Adding..." : "Add to Cart"}
                        </button>
                    </div>
                </div>
            </div>   
        </>
    )
}   