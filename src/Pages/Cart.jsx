import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function Cart(){
    const [cart,setCart] = useState(null)
    const [loading,setLoading] = useState(true)
    const [error,setError] = useState("")
    const navigate = useNavigate()

    const getCartApi = async () => {
        const res = await API.get('/cart')
        return res.data
    }

    const updateCartItemApi = async (productId, quantity) => {
        const res = await API.patch(`/cart/items/${productId}`, { quantity });
        return res.data;
    };

    const removeCartItemApi = async (productId) => {
        const res = await API.delete(`/cart/${productId}`);
        return res.data;
    };
    const loadCart = async() => {
        try{
            const data = await getCartApi()
            setCart(data)
        }catch{
            setError("Failed to load Cart")
        }finally{   
            setLoading(false)
        }
    }
    useEffect(() => {
        loadCart();
    }, []);

    const updateQuantity = async (productId,newQuantity) => {
        if(newQuantity <= 0) return

        try {
            await updateCartItemApi(productId, newQuantity);
            await loadCart();
        } catch (err) {
            alert(err.response?.data?.detail || "Stock not available");
        }
    }
    const removeItem = async (productId) => {
        try {
            await removeCartItemApi(productId);
            await loadCart();
        } catch {
            alert("Failed to remove item");
        }``
    }

    const totalAmount =
        cart?.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        ) || 0;

    if (loading) return <p>Loading cart...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!cart || cart.items.length === 0)
        return <p>Your cart is empty.</p>;

    return(
        <div style={{ padding: "20px" }}>
            <h2>Your Cart</h2>

            {cart.items.map((item) => (
                <div key={item.product_id} style={itemStyle}>
                    <div>
                        <strong>{item.product_name}</strong>
                        <p>₹ {item.price}</p>
                    </div>

                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <button onClick={() => updateQuantity(item.product_id, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)}>+</button>
                    </div>

                    <button onClick={() => removeItem(item.product_id)}>Remove</button>
                </div>
            ))}

            <hr />

            <h3>Total: ₹ {totalAmount}</h3>

            <button onClick={() => navigate("/checkout")}>
                Proceed to Checkout
            </button>
        </div>
  )
}
const itemStyle = {
  display: "flex",
  justifyContent: "space-between",
  borderBottom: "1px solid #ddd",
  padding: "10px 0",
};
