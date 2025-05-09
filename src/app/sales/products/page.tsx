"use client";

type Product = {
  id: number;
  name: string;
  barcode: string;
  price: number;
  quantity: number;
};

const mockProducts: Product[] = [
  { id: 1, name: "Jack Daniels", barcode: "123456789012", price: 29.99, quantity: 12 },
  { id: 2, name: "Jameson", barcode: "234567890123", price: 24.99, quantity: 8 },
  { id: 3, name: "Grey Goose", barcode: "345678901234", price: 39.99, quantity: 5 },
];

export default function ProductsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Product Inventory</h1>
      <table className="min-w-full table-auto border border-gray-300">
        <thead>
          <tr className="">
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Barcode</th>
            <th className="px-4 py-2 border">Price ($)</th>
            <th className="px-4 py-2 border">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {mockProducts.map((product) => (
            <tr key={product.id}>
              <td className="px-4 py-2 border">{product.name}</td>
              <td className="px-4 py-2 border">{product.barcode}</td>
              <td className="px-4 py-2 border">{product.price.toFixed(2)}</td>
              <td className="px-4 py-2 border">{product.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
