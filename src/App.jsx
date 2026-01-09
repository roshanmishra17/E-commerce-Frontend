import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/login";
import SignUp from "./Pages/SignUp";



function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
