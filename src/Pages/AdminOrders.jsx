import API from "../api/axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../CSS/AdminOrders.css'
import NavBar from "./NavBar";


export default function AdminOrders(){

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const getAllOrdersAdminApi = async () => {
        const res = await API.get('orders/admin/orders')
        return res.data
    }

    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role !== "admin") {
            navigate("/");
            return;
        }

        const load = async () => {
            try {
                const result = await getAllOrdersAdminApi();
                const ordersData = result.data ?? result;
                setOrders(ordersData);
            } catch (err) {
                if (err.response?.status === 403) navigate("/");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [navigate]);

    if (loading) return <p className="admin-status">Loading orders...</p>;

    return (
        <>
            <NavBar/>
            <div className="admin-orders-page">
                <h2>Admin – Orders</h2>

                <div className="admin-orders-list">
                    {orders.map((o) => (
                    <div key={o.id} className="admin-order-card">
                        <div className="order-left">
                        <strong>Order #{o.id}</strong>
                        <span className={`status ${o.status}`}>{o.status}</span>
                        <p>User ID: {o.user_id}</p>
                        <p>Total: ₹ {o.total_amount}</p>

                        <div className="order-items-preview">
                            {o.items?.slice(0, 4).map((item) => (
                            <img
                                key={item.product_id}
                                src={item.image_url}
                                alt={item.product_name}
                            />
                            ))}
                        </div>
                        </div>

                        <Link className="manage-btn" to={`/admin/orders/${o.id}`}>
                            Manage
                        </Link>
                    </div>
                    ))}
                </div>
            </div>
        </>
    )
}   
