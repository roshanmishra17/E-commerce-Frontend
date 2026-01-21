import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import '../CSS/Cart.css'
import NavBar from "./NavBar";
import ProductDetails from "./ProductDetails";

export default function Cart(){
    const [cart,setCart] = useState(null)
    const [loading,setLoading] = useState(true)
    const [error,setError] = useState("")
    const [cartError, setCartError] = useState("");
    const [confirmId, setConfirmId] = useState(null);


    const navigate = useNavigate()

    const getCartApi = async () => {
        const res = await API.get('/cart');
        return res.data;
    };

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
            setCartError("")
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
            setCartError(err.response?.data?.detail || "Stock not available");
        }
    }
    // const removeItem = async (productId) => {
    //     try {
    //         await removeCartItemApi(productId);
    //         await loadCart();
    //     } catch {
    //         setCartError("Failed to remove item");
    //     }
    // }
    const openConfirm = (id) => setConfirmId(id);
    const closeConfirm = () => setConfirmId(null);

    const confirmRemove = async () => {
        try {
            await removeCartItemApi(confirmId);
            await loadCart();
        } catch {
            setCartError("Failed to remove item");
        } finally {
            closeConfirm();
        }
    };

    const totalAmount =
        cart?.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        ) || 0;

    if (loading) return <p className="cart-status">Loading cart...</p>;
    if (error) return <p className="cart-status error">{error}</p>;
    if (!cart || cart.items.length === 0)
        return <p className="cart-status">Your cart is empty.</p>;

    return(
        <>
            <NavBar/>
            <div className="cart-page">
                <h2>Your Cart</h2>

                {cartError && <div className="cart-error-box">{cartError}</div>}

                <div className="cart-list">
                    {cart.items.map((item) => (
                        <div className="cart-item" key={item.product_id}>
                            <img
                                src={item.image_url}
                                alt={item.product_name}
                                className="cart-thumb"
                            />
                            <div className="cart-item-content">
                                <div className="cart-info">
                                    <strong>{item.product_name}</strong>
                                    <span>₹ {item.price}</span>
                                </div>

                                <div className="cart-qty">
                                    <button onClick={() => updateQuantity(item.product_id, item.quantity - 1)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)}>+</button>
                                </div>

                                <button
                                    className="remove-btn"
                                    onClick={() => openConfirm(item.product_id)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>

                    ))}
                </div>

                <div className="cart-summary">
                    <h3>Total: ₹ {totalAmount}</h3>

                    <button className="checkout-btn" onClick={() => navigate("/checkout")}>
                        Proceed to Checkout
                    </button>
                </div>
            </div>
            {confirmId && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h3>Remove item?</h3>
                        <p>This product will be removed from your cart.</p>

                        <div className="modal-actions">
                            <button onClick={closeConfirm} className="cancel-btn">Cancel</button>
                            <button onClick={confirmRemove} className="danger-btn">Remove</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
const itemStyle = {
  display: "flex",
  justifyContent: "space-between",
  borderBottom: "1px solid #ddd",
  padding: "10px 0",
};
