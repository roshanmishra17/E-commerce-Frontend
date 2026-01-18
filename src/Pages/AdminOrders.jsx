import API from "../api/axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";


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

    if(!orders) return <p>Loading...</p>
    return (
        <div style={{ padding: 20 }}>
            <h2>Admin – Orders</h2>

            {orders.map((o) => (
                <div key={o.id} style={cardStyle}>
                    <div>
                        <strong>Order #{o.id}</strong>
                        <p>User ID: {o.user_id}</p>
                        <p>Status: {o.status}</p>
                        <p>Total: ₹ {o.total_amount}</p>
                    </div>

                    <Link to={`/admin/orders/${o.id}`}>Manage</Link>
                </div>
            ))}
        </div>
    )
}   
const cardStyle = {
  border: "1px solid #ccc",
  padding: 10,
  marginBottom: 10,
  display: "flex",
  justifyContent: "space-between"
};