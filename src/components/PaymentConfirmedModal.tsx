'use client';

import { formatCurrency } from '@/utils';
import { SaleData } from '@/stores/salesStore';

interface PaymentConfirmedModalProps {
  saleData: SaleData;
  onClose: () => void;
  onPrint: (saleData: SaleData) => void;
}

export function PaymentConfirmedModal({ saleData, onClose, onPrint }: PaymentConfirmedModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
      
      <div className="relative bg-gray-800 rounded-lg p-6 mx-4 w-full max-w-md border border-gray-700 text-center">
        {/* Success Icon */}
        <div className="mb-4">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto">
            <svg 
              className="w-8 h-8 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
        </div>

        {/* Success Message */}
        <h2 className="text-2xl font-bold mb-2 text-gray-100">Payment Confirmed!</h2>
        <p className="text-gray-300 mb-6">Transaction completed successfully</p>

        {/* Transaction Details */}
        <div className="bg-gray-700 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-300">Sale ID:</span>
            <span className="text-gray-100 font-mono text-sm">{saleData.id}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-300">Payment Method:</span>
            <span className="text-gray-100 capitalize">{saleData.paymentMethod}</span>
          </div>
          <div className="flex justify-between items-center border-t border-gray-600 pt-2">
            <span className="text-gray-300 font-semibold">Total Paid:</span>
            <span className="text-amber-400 font-bold text-xl">{formatCurrency(saleData.totalAmount)}</span>
          </div>
          {saleData.changeGiven > 0 && (
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-300">Change Given:</span>
              <span className="text-green-400 font-semibold">{formatCurrency(saleData.changeGiven)}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
            onClick={() => onPrint(saleData)}
          >
            Print Receipt
          </button>
          <button
            className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors"
            onClick={onClose}
          >
            New Sale
          </button>
        </div>

        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors"
          onClick={onClose}
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}