import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import '../CSS/OrderDetails.css'
import API from "../api/axios";
import NavBar from "./NavBar";

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
                if (err.response?.status === 401) navigate("/login");
                    else if (err.response?.status === 403)
                        setError("You are not allowed to view this order");
                    else {
                        setError("Order not found");
                    }
            } finally {
                setLoading(false);
            }
        };
        loadOrder();
    }, [id, navigate]);

    if (loading) return <p className="order-status">Loading order...</p>;
    if (error) return <p className="order-status error">{error}</p>;
    if (!order) return null;

    return (
        <>
            <NavBar/>
            <div className="order-details-page">
                <h2>Order #{order.id}</h2>

                <div className="order-meta">
                    <span>Status: {order.status}</span>
                    <span>Total: ₹ {order.total_amount}</span>
                </div>

                <h3>Items</h3>

                {order.items.length === 0 && <p>No items</p>}

                <div className="order-items">
                    {order.items.map((item) => (
                        <div className="order-item" key={item.product_id}>
                            <img 
                                src={item.image_url}
                                alt={item.product_name}
                            />
                            <div className="item-info">
                                <span>{item.product_name}</span>
                                <span>
                                    {item.quantity} × ₹{item.product_price}
                                </span>
                            </div>
                            <div className="item-total">
                                <span>₹ {item.quantity * item.product_price}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

