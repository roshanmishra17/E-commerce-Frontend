import API from "../api/axios";
import { useNavigate,Link } from "react-router-dom";
import { useState,useEffect } from "react";
import NavBar from "./NavBar";
import '../CSS/Orders.css'

export default function Orders(){

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [payingId, setPayingId] = useState(null);
    const navigate = useNavigate();

    const getMyOrdersApi = async () => {
        const res = await API.get("/orders");
        return res.data;
    };

    const payOrderApi = async (id) => {
        const res = await API.post(`/orders/${id}/pay`);
        return res.data;
    };

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const result = await getMyOrdersApi();
                setOrders(result.data);
            }catch (err) {
                if (err.response.status === 401) {
                    navigate("/login");
                } else {
                    setError("Failed to load orders");
                }
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, [navigate]);

    const handlePay = async (id) => {
        try {
            setPayingId(id)
            await payOrderApi(id);
            window.location.reload();
        } catch(err){
            setError(err.response?.data?.detail || "Payment failed");
        }finally {
            setPayingId(null);
        }
    };
    if (loading) return <p className="orders-status">Loading orders...</p>;
    if (error) return <p className="orders-status error">{error}</p>;
    if (orders.length === 0) return <p className="orders-status">No orders yet.</p>;

    return (    
        <>
            <NavBar/>
            <div className="orders-page">
                <h2>My Orders</h2>

                <div className="orders-list">
                    {orders.map((order) => (
                        <div key={order.id} className="order-card">
                            <div className="order-info">
                                <strong>Order #{order.id}</strong>
                                <div className="order-items-preview">
                                    {order.items.map((item) => (
                                        <img
                                            key={item.product_name}
                                            src={item.image_url}
                                            alt={item.product_name}
                                        />
                                    ))}
                                </div>
                                <span className={`status ${order.status}`}>
                                    {order.status.toUpperCase()}
                                </span>
                                <p>Total: ₹ {order.total_amount}</p>
                            </div>

                            <div className="order-actions">
                                <Link to={`/orders/${order.id}`} className="details-link">View Details</Link>
                                {order.status === "pending" && (
                                    <button
                                        onClick={() => handlePay(order.id)}
                                        disabled={payingId === order.id}
                                        className="pay-btn"
                                    >
                                        {payingId === order.id ? "Processing..." : "Pay Now"}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

const cardStyle = {
  border: "1px solid #ddd",
  padding: "10px",
  marginBottom: "10px",
  display: "flex",
  justifyContent: "space-between",
};