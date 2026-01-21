import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import NavBar from "./NavBar";
import '../CSS/AdminOrderDetails.css'

export default function AdminOrderDeatils(){
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [status, setStatus] = useState("");
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");


    const getAdminOrderByIdApi = async (id) => {
        const res = await API.get(`orders/admin/${id}`);
        return res.data;
    };

    const updateOrderStatusApi = async (id, status) => {
        const res = await API.patch(`orders/admin/orders/${id}/status`, { status });
        return res.data;
    };

    const load = async () => {
        try{
            const data = await getAdminOrderByIdApi(id);
            setOrder(data);
            setStatus(data.status);
        }catch{
            setError("Failed to load Order")
        }
    };

    useEffect(() => {
        load();
    }, [id]);

    const updateStatus = async () => {
        try{

            setUpdating(true)
            setMessage("")
            await updateOrderStatusApi(id,status)
            await load()
            setMessage("Order status updated successfully");
            
        }catch {
            setMessage("Failed to update order status");
        }finally{
            setUpdating(false)
        }
    };

    if (error) return <p className="admin-order-status error">{error}</p>;
    if (!order) return <p className="admin-order-status">Loading...</p>;

    return (
        <>
            <NavBar/>
            <div className="admin-order-details-page">
                <h2>Order #{order.id}</h2>

                <div className="order-summary">
                    <p>User ID: {order.user_id}</p>
                    <p>Total: ₹ {order.total_amount}</p>
                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                        {order.status}
                    </span>
                </div>

                <h3>Items</h3>

                <div className="admin-order-items">
                    {order.items.map((i) => (
                        <div key={i.id} className="admin-order-item">
                            <img
                                src={i.image_url}
                                alt={i.product_name}
                            />
                            <div className="item-info">
                                <strong>{i.product_name}</strong>
                                <span>Quantity: {i.quantity}</span>
                                <span>Price: ₹ {i.product_price}</span>
                            </div>
                            <div className="item-total">
                                ₹ {i.quantity * i.product_price}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="status-panel">
                    <h3>Update Status</h3>

                    <div className="status-controls">
                        <select value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="PENDING">PENDING</option>
                            <option value="PAID">PAID</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                        </select>
                        <button onClick={updateStatus} disabled={updating}>
                            {updating ? "Updating..." : "Update Status"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}