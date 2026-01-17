import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";


export default function Checkout(){

    const navigate = useNavigate()
    const[cart,setCart] = useState(null)
    const [loading, setLoading] = useState(true);
    const [placing, setPlacing] = useState(false);
    const [error, setError] = useState("");


    const createOrder = async () => {
        const res = await API.post("/orders");
        return res.data;
    };

    const getMyOrders = async () => {
        const res = await API.get("/orders");
        return res.data;
    };

    const getOrderById = async (id) => {
        const res = await API.get(`/orders/${id}`);
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
        try {
            setPlacing(true);
            const order = await createOrder();
            navigate(`/orders/${order.id}`);
        } catch (err) {
            alert(err.response?.data?.detail || "Order failed");
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
        <div style={{ padding: "20px" }}>
            <h2>Checkout</h2>

            {cart.items.map((item) => (
                <div key={item.product_id} style={{ marginBottom: "10px" }}>
                    {item.product_name} × {item.quantity} — ₹{item.price * item.quantity}
                </div>
            ))}

            <hr />
            <h3>Total: ₹ {total}</h3>

            <button onClick={placeOrder} disabled={placing}>
                {placing ? "Placing order..." : "Place Order"}
            </button>
        </div>
    );
}