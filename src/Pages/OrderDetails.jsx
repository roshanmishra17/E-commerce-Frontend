import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function OrderDetails(){

    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const getOrderByIdApi = async (id) => {
        const res = await API.get(`/orders/${id}`);
        return res.data;
    };

    useEffect(() => {
        const loadOrder = async () => {
            try {
                const data = await getOrderByIdApi(id);
                setOrder(data);
            } catch (err) {
                if (err.response?.status === 401) {
                    navigate("/login");
                } else if (err.response?.status === 403) {
                    setError("You are not allowed to view this order");
                } else {
                    setError("Order not found");
                }
            } finally {
                setLoading(false);
            }
        };
        loadOrder();
    }, [id, navigate]);

    if (loading) return <p>Loading order...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!order) return null;

    return (
        <div style={{ padding: "20px" }}>
            <h2>Order #{order.id}</h2>

            <p>Status: {order.status}</p>
            <p>Total: ₹ {order.total_amount}</p>

            <h3>Items</h3>

            {order.items.length === 0 && <p>No items</p>}

            {order.items.map((item) => (
                <div key={item.id} style={itemStyle}>
                    <span>{item.product_name}</span>
                    <span>
                        {item.quantity} × ₹{item.product_price}
                    </span>
                    <span>₹ {item.quantity * item.product_price}</span>
                </div>
            ))}
        </div>
    );
}

const itemStyle = {
  display: "flex",
  justifyContent: "space-between",
  borderBottom: "1px solid #ddd",
  padding: "6px 0",
};
