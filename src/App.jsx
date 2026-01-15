import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/login";
import SignUp from "./Pages/SignUp";
import Products from "./Pages/Products"



function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Products/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/products" element={<Products/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
