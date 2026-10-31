import { Link, NavLink } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import './Navbar.css';

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* Brand Logo - Left Side */}
        <Link to="/" className="navbar-logo">
          <ShoppingBag size={25} strokeWidth={2.2} />
          <span>
            Product<span className="logo-highlight">Hub</span>
          </span>
        </Link>

        <nav className="navbar-links">
          <NavLink to="/" end>
            Home
          </NavLink>

          <NavLink to="/products">
            Products
          </NavLink>

          <NavLink to="/wishlist">
            Wishlist
          </NavLink>

          <NavLink to="/cart">
            Cart
          </NavLink>
        </nav>

      </div>
    </header>
  );
}

export default Navbar;