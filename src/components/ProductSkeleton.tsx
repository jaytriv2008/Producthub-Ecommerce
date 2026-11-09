const ProductSkeleton = () => {
  return (
    <div className="product-loading-container">
      <div className="product-spinner"></div>

      <h3>Loading Product...</h3>

      <p>Please wait while we fetch product details.</p>
    </div>
  );
};

export default ProductSkeleton;