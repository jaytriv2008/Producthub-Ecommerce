
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, ShoppingBag } from 'lucide-react';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-content">

        <div className="not-found-logo">
          <ShoppingBag size={28} />
          <span>Product<span className="logo-highlight">Hub</span></span>
        </div>

        <h1 className="error-code">404</h1>

        <h2>Oops! Page Not Found</h2>

        <p>
          The page you're looking for doesn't exist or may have been moved.
          Let's get you back to shopping.
        </p>

        <div className="not-found-buttons">
          <Link to="/" className="home-button">
            <Home size={18} />
            Go to Home
          </Link>

          <button
            className="back-button"
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>

        <span className="error-message">
          Error Code: 404 | Page Not Found
        </span>

      </div>
    </div>
  );
};

export default NotFound;
