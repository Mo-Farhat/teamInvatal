import React, { useState } from "react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import Papa from "papaparse"; // CSV parser

interface Product {
  name: string;
  quantity: number;
  price: number;
  minSellingPrice: number;
  stock: number;
  lowStockThreshold: number;
  barcode: string;
  manufacturer: string;
  productId: string;
}

interface ProductFormProps {
  onSubmit: (products: Product[]) => Promise<void>;
}

const ProductForm: React.FC<ProductFormProps> = ({ onSubmit }) => {
  const [products, setProducts] = useState<Product[]>([]);

  // 📌 Handle CSV Import (Multiple Rows)
  const handleCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (result) => {
        const data = result.data as string[][]; // CSV as an array of arrays
        if (data.length < 2) return; // Ensure there’s data

        const importedProducts = data.slice(1).map((row) => ({
          name: row[0] || "",
          quantity: parseInt(row[1]) || 0,
          price: parseFloat(row[2]) || 0,
          minSellingPrice: parseFloat(row[3]) || 0,
          stock: parseInt(row[4]) || 0,
          lowStockThreshold: parseInt(row[5]) || 0,
          barcode: row[6] || "",
          manufacturer: row[7] || "",
          productId: row[8] || "",
        }));

        setProducts(importedProducts);
      },
      header: false,
      skipEmptyLines: true,
    });
  };

  // 📌 Handle Form Submission (Submit All Products)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (products.length === 0) return;
    await onSubmit(products);
    setProducts([]); // Clear table after submission
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Products via CSV</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* CSV Upload Button */}
          <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
            Import CSV
            <input type="file" accept=".csv" onChange={handleCSVImport} className="hidden" />
          </label>

          {/* Show Imported Data in Table */}
          {products.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 mt-4">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Quantity</th>
                    <th className="px-4 py-2">Price</th>
                    <th className="px-4 py-2">Min Selling Price</th>
                    <th className="px-4 py-2">Stock</th>
                    <th className="px-4 py-2">Low Stock</th>
                    <th className="px-4 py-2">Barcode</th>
                    <th className="px-4 py-2">Manufacturer</th>
                    <th className="px-4 py-2">Product ID</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-2">{product.name}</td>
                      <td className="px-4 py-2">{product.quantity}</td>
                      <td className="px-4 py-2">{product.price}</td>
                      <td className="px-4 py-2">{product.minSellingPrice}</td>
                      <td className="px-4 py-2">{product.stock}</td>
                      <td className="px-4 py-2">{product.lowStockThreshold}</td>
                      <td className="px-4 py-2">{product.barcode}</td>
                      <td className="px-4 py-2">{product.manufacturer}</td>
                      <td className="px-4 py-2">{product.productId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Submit Button (Only if Products are Loaded) */}
          {products.length > 0 && (
            <Button type="submit" className="w-full mt-4">Add Products</Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductForm;
