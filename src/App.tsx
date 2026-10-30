import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import PlaceholderPage from './pages/PlaceholderPage';
import Products from './pages/Products';

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route
          path="/products"
          element={<PlaceholderPage title="All Products" description="Our real product catalogue will be connected to DummyJSON on Day 3." />}
        />
        <Route
          path="/products/:id"
          element={<PlaceholderPage title="Product Details" description="The product details page will be built as the project progresses." />}
        />
        <Route
          path="/wishlist"
          element={<PlaceholderPage title="Your Wishlist" description="Save the products you love here. Wishlist functionality will be added later." />}
        />
        <Route
          path="/cart"
          element={<PlaceholderPage title="Your Cart" description="Your selected products will appear here once cart functionality is added." />}
        />
        <Route
          path="*"
          element={<PlaceholderPage title="Page not found" description="The page you are looking for does not exist." />}
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
