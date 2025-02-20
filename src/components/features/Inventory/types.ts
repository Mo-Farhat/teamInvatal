export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number; // Consider removing quantity if it's redundant
  quantity: number; // Consider consolidating with stock
  minSellingPrice: number;
  lowStockThreshold: number;
  imageUrl?: string;
  barcode?: string;
  manufacturer?: string;
  productId?: string; // Add productId to the base interface as optional
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductWithFile extends Omit<Product, "id"> {
  imageFile?: File;
  productId: string; // Change from String to string (lowercase)
}
