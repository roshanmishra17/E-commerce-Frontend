import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import Products from "./Pages/Products"
import ProductDetails from "./Pages/ProductDetails";
import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import Orders from "./Pages/Orders";
import OrderDetails from "./Pages/OrderDetails";
import AdminOrders from "./Pages/AdminOrders";
import AdminOrderDeatils from "./Pages/AdminOrderDetails";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Products/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/products" element={<Products/>}/>
          <Route path="/products/:slug" element={<ProductDetails/>}/>
          <Route path="/cart" element={<Cart/>}/>
          <Route path="/checkout" element = {<Checkout/>}/>
          <Route path="/orders" element={<Orders/>}/>
          <Route path="/orders/:id" element={<OrderDetails/>}/>
          <Route path="/admin/orders" element={<AdminOrders/>}/>
          <Route path="/admin/orders/:id" element={<AdminOrderDeatils/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
