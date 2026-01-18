import API from "../api/axios";
import { useNavigate,Link } from "react-router-dom";
import { useState,useEffect } from "react";

export default function Orders(){

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const getMyOrdersApi = async () => {
        const res = await API.get("/orders");
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

    if (loading) return <p>Loading orders...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (orders.length === 0) return <p>No orders yet.</p>;

    return (
        <div style={{ padding: "20px" }}>
            <h2>My Orders</h2>

            {orders.map((order) => (
                <div key={order.id} style={cardStyle}>
                    <div>
                        <strong>Order #{order.id}</strong>
                        <p>Status: {order.status}</p>
                        <p>Total: ₹ {order.total_amount}</p>
                    </div>

                    <Link to={`/orders/${order.id}`}>View Details</Link>
                </div>
            ))}
        </div>
    );
}

const cardStyle = {
  border: "1px solid #ddd",
  padding: "10px",
  marginBottom: "10px",
  display: "flex",
  justifyContent: "space-between",
};