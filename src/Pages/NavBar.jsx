import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../CSS/NavBar.css";

export default function NavBar() {
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setIsScrolled] = useState(false);

    const token = localStorage.getItem("token")
    const role = localStorage.getItem("role")

    useEffect(() => {
    const handleScroll = () => {
        setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const logout = () => {
        localStorage.clear();
        navigate("/login");
    };

    function toggleMenu(){
        setIsOpen(!isOpen);
    }
  return (
    <header className={`navbar ${scrolled ? "scroll" : ""}`}>
      <div className="navbar-logo">
        <h1>E-Online</h1>
      </div>

      <nav className={`navbar-nav ${isOpen ? "open" : ""}`}>
        <ul>
          <li>
            <Link to="/products">Products</Link>
          </li>

          {role === "customer" && token && (
            <>
              <li>
                <Link to="/cart">Cart</Link>
              </li>

              <li>
                <Link to="/orders">My Orders</Link>
              </li>
            </>
          )}

          {!token ? (
            <li>
              <Link className="loginBtn" to="/login">
                Login
              </Link>
            </li>
          ) : (
            <li>
              <button className="logoutBtn" onClick={logout}>
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>

      <div className="hamburger" onClick={toggleMenu}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
    </header>
  );
}
