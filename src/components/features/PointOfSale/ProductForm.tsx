import React, { useState } from 'react';
import { Product } from './types';
import Papa from 'papaparse';

interface ProductFormProps {
  onAddProduct: (product: Product) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ onAddProduct }) => {
  const [product, setProduct] = useState<Partial<Product>>({});
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (product.name && product.price && product.stock) {
      onAddProduct({ id: Date.now().toString(), ...product } as Product);
      setProduct({});
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCsvFile(e.target.files[0]);
    }
  };

  const handleCSVImport = () => {
    if (!csvFile) return;
    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        result.data.forEach((row: any) => {
          const newProduct: Product = {
            id: Date.now().toString(),
            name: row.name || '',
            stock: Number(row.stock) || 0,
            price: Number(row.price) || 0,
            minSellingPrice: Number(row.minSellingPrice) || 0,
            productId: row.productId || '',
            barcode: row.barcode || '',
            manufacturer: row.manufacturer || '',
            imageUrl: row.imageUrl || '',
            lowStockThreshold: Number(row.lowStockThreshold) || 5,
          };
          onAddProduct(newProduct);
        });
      },
    });
  };

  return (
    <div className="p-4 bg-white shadow rounded-md">
      <h2 className="text-lg font-bold mb-4">Add Product</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="text" name="name" placeholder="Product Name" onChange={handleChange} className="w-full p-2 border" />
        <input type="number" name="stock" placeholder="Stock" onChange={handleChange} className="w-full p-2 border" />
        <input type="number" name="price" placeholder="Price" onChange={handleChange} className="w-full p-2 border" />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white">Add Product</button>
      </form>
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Import from CSV</h3>
        <input type="file" accept=".csv" onChange={handleFileUpload} className="mb-2" />
        <button onClick={handleCSVImport} className="px-4 py-2 bg-green-500 text-white">Import CSV</button>
      </div>
    </div>
  );
};

export default ProductForm;
