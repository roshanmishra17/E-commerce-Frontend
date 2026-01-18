import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";

export default function AdminOrderDeatils(){
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [status, setStatus] = useState("");

    const getAdminOrderByIdApi = async (id) => {
        const res = await API.get(`orders/admin/${id}`);
        return res.data;
    };

    const updateOrderStatusApi = async (id, status) => {
        const res = await API.patch(`orders/admin/orders/${id}/status`, { status });
        return res.data;
    };

    const load = async () => {
        const data = await getAdminOrderByIdApi(id);
        setOrder(data);
        setStatus(data.status);
    };

    useEffect(() => {
        load();
    }, [id]);

    const updateStatus = async () => {
        await updateOrderStatusApi(id, status);
        alert("Status updated");
        load();
    };

    if (!order) return <p>Loading...</p>;

    return (
        <div style={{ padding: 20 }}>
            <h2>Order #{order.id}</h2>

            <p>User ID: {order.user_id}</p>
            <p>Total: ₹ {order.total_amount}</p>

            <h3>Items</h3>
            {order.items.map((i) => (
                <div key={i.id}>
                    {i.product_name} × {i.quantity}
                </div>
            ))}

            <h3>Status</h3>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="PENDING">PENDING</option>
                <option value="PAID">PAID</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
            </select>


            <button onClick={updateStatus}>Update</button>
        </div>
    );
}