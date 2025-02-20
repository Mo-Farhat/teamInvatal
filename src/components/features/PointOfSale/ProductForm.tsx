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
  const [error, setError] = useState<string | null>(null);

  // 📌 Validate CSV File Format
  const validateCSV = (data: string[][]) => {
    const expectedColumns = 9; // Expected number of columns
    return data.every((row) => row.length === expectedColumns);
  };

  // 📌 Handle CSV Import (Multiple Rows)
  const handleCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (result) => {
        const data = result.data as string[][]; // CSV as an array of arrays
        if (data.length < 2) {
          setError("CSV file is empty or improperly formatted.");
          return;
        }

        // Validate format
        if (!validateCSV(data.slice(1))) {
          setError("Invalid CSV format. Please ensure all columns are present.");
          return;
        }

        setError(null); // Clear previous errors

        // Convert CSV rows to product objects
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

  // 📌 Handle Input Changes in the Table
  const handleInputChange = (index: number, field: keyof Product, value: string) => {
    const updatedProducts = [...products];
    updatedProducts[index] = { ...updatedProducts[index], [field]: value };
    setProducts(updatedProducts);
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

          {/* Error Message */}
          {error && <p className="text-red-500 mt-2">{error}</p>}

          {/* Show Imported Data in Editable Table */}
          {products.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 mt-4">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    {["Name", "Quantity", "Price", "Min Selling Price", "Stock", "Low Stock", "Barcode", "Manufacturer", "Product ID"].map((header) => (
                      <th key={header} className="px-4 py-2">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={index} className="border-b">
                      {Object.keys(product).map((field) => (
                        <td key={field} className="px-4 py-2">
                          <Input
                            type={field.includes("price") ? "number" : "text"}
                            value={String(product[field as keyof Product])}
                            onChange={(e) => handleInputChange(index, field as keyof Product, e.target.value)}
                          />
                        </td>
                      ))}
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
