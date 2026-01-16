import { useState,useEffect } from "react";
import { useNavigate,useParams } from "react-router-dom";
import API from "../api/axios";

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

    const addToCartApi = async (product_id,quantity = 1) => {
        const res = await API.post("/cart",{
            product_id: product_id,
            quantity: quantity
        })
        return res.data
    }

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

        if(!isAuth){
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
    if (error) return <p>{error}</p>
    if (!product) return <p>Loading...</p>

    return(
        <div style={{padding:'20'}}>
            <img
                src={product.image_url || "https://via.placeholder.com/200"}
                alt={product.name}
                style={{ width: "300px" }}
            />
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>₹ {product.price}</p>
            <p>Category: {product.category?.name}</p>

            <button onClick={handleAddToCart} disabled={adding}>
                {adding ? "Adding..." : "Add to Cart"}
            </button>
        </div>    
    )
}   