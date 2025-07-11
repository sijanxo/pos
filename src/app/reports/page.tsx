'use client';

import { useEffect, useState } from 'react';
import { SalesHistoryList } from '@/components/SalesHistoryList';
import { useSalesStore } from '@/stores/salesStore';
import { generateId } from '@/utils';

export default function Reports() {
  const { salesHistory, addSale } = useSalesStore();
  const [hasInitialized, setHasInitialized] = useState(false);

  // Generate sample sales data for testing
  const generateSampleSales = () => {
    const sampleSales = [
      {
        id: generateId(),
        saleDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        totalAmount: 8999, // $89.99 in cents
        taxAmount: 799, // $7.99 in cents
        discountAmount: 0,
        paymentMethod: 'card' as const,
        cashierId: 'user123',
        isRefund: false,
        originalSaleId: null,
        changeGiven: 0,
        items: [
          {
            productId: 'wine001',
            name: 'Cabernet Sauvignon',
            quantity: 2,
            priceAtSale: 2499, // $24.99 in cents
            costAtSale: 1500, // $15.00 in cents
            appliedDiscount: 0,
            finalLineTotal: 4998, // $49.98 in cents
          },
          {
            productId: 'spirits001',
            name: 'Premium Vodka',
            quantity: 1,
            priceAtSale: 3500, // $35.00 in cents
            costAtSale: 2000, // $20.00 in cents
            appliedDiscount: 0,
            finalLineTotal: 3500, // $35.00 in cents
          }
        ]
      },
      {
        id: generateId(),
        saleDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        totalAmount: 4599, // $45.99 in cents
        taxAmount: 399, // $3.99 in cents
        discountAmount: 500, // $5.00 discount
        paymentMethod: 'cash' as const,
        cashierId: 'user456',
        isRefund: false,
        originalSaleId: null,
        changeGiven: 401, // $4.01 in cents
        items: [
          {
            productId: 'beer001',
            name: 'Craft IPA 6-Pack',
            quantity: 3,
            priceAtSale: 1299, // $12.99 in cents
            costAtSale: 800, // $8.00 in cents
            appliedDiscount: 0,
            finalLineTotal: 3897, // $38.97 in cents
          },
          {
            productId: 'wine002',
            name: 'Chardonnay',
            quantity: 1,
            priceAtSale: 1999, // $19.99 in cents
            costAtSale: 1200, // $12.00 in cents
            appliedDiscount: 0,
            finalLineTotal: 1999, // $19.99 in cents
          }
        ]
      },
      {
        id: generateId(),
        saleDate: new Date().toISOString(), // Today
        totalAmount: 12999, // $129.99 in cents
        taxAmount: 1099, // $10.99 in cents
        discountAmount: 0,
        paymentMethod: 'card' as const,
        cashierId: 'user789',
        isRefund: false,
        originalSaleId: null,
        changeGiven: 0,
        items: [
          {
            productId: 'spirits002',
            name: 'Single Malt Whisky',
            quantity: 1,
            priceAtSale: 8999, // $89.99 in cents
            costAtSale: 5000, // $50.00 in cents
            appliedDiscount: 0,
            finalLineTotal: 8999, // $89.99 in cents
          },
          {
            productId: 'wine003',
            name: 'Pinot Noir',
            quantity: 1,
            priceAtSale: 2999, // $29.99 in cents
            costAtSale: 1800, // $18.00 in cents
            appliedDiscount: 0,
            finalLineTotal: 2999, // $29.99 in cents
          }
        ]
      }
    ];

    sampleSales.forEach(sale => addSale(sale));
    setHasInitialized(true);
  };

  useEffect(() => {
    // Only initialize sample data if there's no existing sales data
    if (salesHistory.length === 0 && !hasInitialized) {
      generateSampleSales();
    }
  }, [salesHistory.length, hasInitialized]);

  return (
    <div className="reports-page min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="page-header mb-8">
          <h1 className="page-title text-3xl font-bold text-text">Reports & Analytics</h1>
          <p className="page-description text-muted mt-2">
            View sales reports, analytics, and business insights
          </p>
        </div>

        <div className="content-area">
          <div className="mb-4 flex justify-between items-center">
            <div className="text-sm text-muted">
              Click on any sale to view detailed receipt
            </div>
            {salesHistory.length === 0 && (
              <button
                onClick={generateSampleSales}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
              >
                Generate Sample Data
              </button>
            )}
          </div>
          <SalesHistoryList />
        </div>
      </div>
    </div>
  );
}