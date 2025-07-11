'use client';

import { formatCurrency, formatDateTime } from '@/utils';
import { SaleData } from '@/stores/salesStore';

interface ReceiptDisplayProps {
  saleData: SaleData;
}

export function ReceiptDisplay({ saleData }: ReceiptDisplayProps) {
  // Calculate subtotal from items
  const subtotal = saleData.items.reduce((sum, item) => sum + item.finalLineTotal, 0);

  return (
    <div className="receipt-display bg-white border rounded-lg p-6 max-w-md mx-auto font-mono text-sm">
      {/* Receipt Header */}
      <div className="receipt-header text-center mb-6 border-b pb-4">
        <h1 className="text-lg font-bold mb-2">Premium Liquor Store</h1>
        <p className="text-xs text-gray-600">123 Main Street, Anytown, USA</p>
        <p className="text-xs text-gray-600">Phone: (555) 123-4567</p>
      </div>

      {/* Sale Information */}
      <div className="sale-info mb-4 space-y-1">
        <div className="flex justify-between">
          <span className="font-semibold">Sale ID:</span>
          <span>{saleData.id}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Date:</span>
          <span>{formatDateTime(saleData.saleDate)}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Cashier:</span>
          <span>{saleData.cashierId}</span>
        </div>
      </div>

      {/* Items Purchased */}
      <div className="items-section mb-4">
        <h3 className="font-semibold mb-2 border-b pb-1">Items Purchased</h3>
        <div className="space-y-2">
          {saleData.items.map((item, index) => (
            <div key={index} className="item-row">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-gray-600 flex justify-between">
                    <span>{item.quantity} × {formatCurrency(item.priceAtSale)}</span>
                  </div>
                </div>
                <div className="font-semibold ml-4">
                  {formatCurrency(item.finalLineTotal)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totals Section */}
      <div className="totals-section border-t pt-4 space-y-1">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax:</span>
          <span>{formatCurrency(saleData.taxAmount)}</span>
        </div>
        {saleData.discountAmount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount:</span>
            <span>-{formatCurrency(saleData.discountAmount)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
          <span>Total:</span>
          <span>{formatCurrency(saleData.totalAmount)}</span>
        </div>
      </div>

      {/* Payment Information */}
      <div className="payment-section mt-4 pt-4 border-t space-y-1">
        <div className="flex justify-between">
          <span className="font-semibold">Payment Method:</span>
          <span className="capitalize">{saleData.paymentMethod}</span>
        </div>
        {saleData.paymentMethod === 'cash' && saleData.changeGiven > 0 && (
          <div className="flex justify-between">
            <span className="font-semibold">Change Given:</span>
            <span>{formatCurrency(saleData.changeGiven)}</span>
          </div>
        )}
      </div>

      {/* Receipt Footer */}
      <div className="receipt-footer text-center mt-6 pt-4 border-t text-xs text-gray-600">
        <p className="mb-1">Thank you for your business!</p>
        <p>Please drink responsibly.</p>
      </div>
    </div>
  );
}