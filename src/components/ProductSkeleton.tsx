import './ProductSkeleton.css';

type ProductSkeletonProps = {
  count?: number;
};

const ProductSkeleton = ({ count = 4 }: ProductSkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <div className="skeleton-card" key={index} aria-hidden="true">
          <div className="skeleton-image" />
          <div className="skeleton-line skeleton-category" />
          <div className="skeleton-line skeleton-title" />
          <div className="skeleton-line skeleton-price" />
        </div>
      ))}
    </>
  );
};

export default ProductSkeleton;
