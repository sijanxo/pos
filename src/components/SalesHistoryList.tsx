'use client';

import React, { useState } from 'react';
import { formatCurrency, formatDateTime } from '@/utils';
import { useSalesHistory } from '@/stores/salesStore';
import { SaleData } from '@/stores/salesStore';
import { ReceiptDisplay } from './ReceiptDisplay';
import { X } from 'lucide-react';

interface SalesHistoryListProps {
  className?: string;
}

export function SalesHistoryList({ className = '' }: SalesHistoryListProps) {
  const salesHistory = useSalesHistory();
  const [selectedSale, setSelectedSale] = useState<SaleData | null>(null);

  const handleSaleClick = (sale: SaleData) => {
    setSelectedSale(sale);
  };

  const handleCloseModal = () => {
    setSelectedSale(null);
  };

  if (salesHistory.length === 0) {
    return (
      <div className={`sales-history-empty ${className}`}>
        <div className="text-center py-8">
          <p className="text-muted text-lg">No sales history available</p>
          <p className="text-muted text-sm mt-2">Sales will appear here once transactions are completed</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`sales-history-list ${className}`}>
        <div className="bg-card border border-muted rounded-lg overflow-hidden">
          <div className="sales-header bg-gray-50 border-b border-muted p-4">
            <h2 className="text-lg font-semibold text-text">Sales History</h2>
            <p className="text-sm text-muted mt-1">
              {salesHistory.length} total sales
            </p>
          </div>
          
          <div className="sales-table">
            <div className="table-header bg-gray-50 border-b border-muted p-3 grid grid-cols-5 gap-4 text-sm font-medium text-text">
              <div>Sale ID</div>
              <div>Date</div>
              <div>Cashier</div>
              <div>Total Amount</div>
              <div>Payment Method</div>
            </div>
            
            <div className="table-body">
              {salesHistory.map((sale) => (
                <div
                  key={sale.id}
                  className="table-row grid grid-cols-5 gap-4 p-3 border-b border-muted hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleSaleClick(sale)}
                >
                  <div className="text-sm font-medium text-text">
                    {sale.id}
                  </div>
                  <div className="text-sm text-muted">
                    {formatDateTime(sale.saleDate)}
                  </div>
                  <div className="text-sm text-muted">
                    {sale.cashierId}
                  </div>
                  <div className="text-sm font-medium text-text">
                    {formatCurrency(sale.totalAmount)}
                  </div>
                  <div className="text-sm text-muted capitalize">
                    {sale.paymentMethod}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Receipt Display */}
      {selectedSale && (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleCloseModal}>
          <div className="modal-content bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-text">Receipt Details</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="modal-body p-4">
              <ReceiptDisplay saleData={selectedSale} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}