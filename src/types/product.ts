
export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  discountPercentage: number;
  thumbnail: string;
  images: string[];
  stock: number;
  brand?: string;
}

export interface ProductApiResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}
