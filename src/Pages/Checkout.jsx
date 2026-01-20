import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import NavBar from "./NavBar";
import '../CSS/Checkout.css'


export default function Checkout(){

    const navigate = useNavigate()
    const[cart,setCart] = useState(null)
    const [loading, setLoading] = useState(true);
    const [placing, setPlacing] = useState(false);
    const [error, setError] = useState("");
    const [orderError, setOrderError] = useState("");
    const [address, setAddress] = useState({
        fullName: "",
        phone: "",
        line1: "",
        city: "",
        state: "",
        pincode: ""
    });

    const createOrder = async () => {
        const res = await API.post("/orders");
        return res.data;
    };

    const getCartApi = async () => {
        const res = await API.get('/cart')
        return res.data
    }

    useEffect(() => {
        const loadCart = async () => {
            try {
                const data = await getCartApi();
                setCart(data);
            } catch {
                setError("Failed to load cart");
            } finally {
                setLoading(false);
            }
        };

        loadCart();
    }, []);

    
    const placeOrder = async () => {
        if (
            !address.fullName ||
            !address.phone ||
            !address.line1 ||
            !address.city ||
            !address.state ||
            !address.pincode
        ) {
            setOrderError("Please fill in all address fields.");
            return;
        }

        try {
            setPlacing(true);
            setOrderError("");
            const order = await createOrder();
            navigate(`/orders/${order.id}`);
        } catch (err) {
            setOrderError(err.response?.data?.detail || "Order failed");
        } finally {
            setPlacing(false);
        }
    };

    

    if (loading) return <p>Loading checkout...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!cart || cart.items.length === 0) return <p>Your cart is empty.</p>;

    const total = cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,0
    );

    return (
        <>
            <NavBar/>
            <div className="checkout-page">
                <h2>Checkout</h2>

                <div className="address-section">
                    <h3>Delivery Address</h3>

                    <div className="address-grid">
                        <input
                            placeholder="Full Name"
                            value={address.fullName}
                            onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                        />

                        <input
                            placeholder="Phone Number"
                            value={address.phone}
                            onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                        />

                        <input
                            placeholder="Address Line"
                            value={address.line1}
                            onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                            className="full"
                        />

                        <input
                            placeholder="City"
                            value={address.city}
                            onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        />

                        <input
                            placeholder="State"
                            value={address.state}
                            onChange={(e) => setAddress({ ...address, state: e.target.value })}
                        />

                        <input
                            placeholder="Pincode"
                            value={address.pincode}
                            onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                        />
                    </div>
                </div>
                
                <div className="checkout-list">
                    {cart.items.map((item) => (
                        <div key={item.product_id} className="checkout-item">
                            <img
                                src={item.image_url}
                                alt={item.product_name}
                            />

                            <div className="checkout-info">
                                <h4>{item.product_name}</h4>
                                <span className="qty">Qty: {item.quantity}</span>
                            </div>

                            <div className="checkout-price">
                                ₹ {item.price * item.quantity}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="checkout-summary">
                    <h3>Total: ₹ {total}</h3>

                    <button onClick={placeOrder} disabled={placing}>
                        {placing ? "Placing order..." : "Place Order"}
                    </button>
                </div>
            </div>
        </>
    );
}