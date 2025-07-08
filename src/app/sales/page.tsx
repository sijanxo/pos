'use client';

import { useState } from 'react';
import { ProductSearch, Cart, Checkout } from '@/components/pos';

export default function Sales() {
  const [activeTab, setActiveTab] = useState<'search' | 'checkout'>('search');

  return (
    <div className="sales-dashboard h-screen bg-background overflow-hidden">
      {/* Main POS Interface */}
      <div className="pos-interface h-full grid grid-cols-12 gap-4 p-4">
        {/* Left Panel - Product Search (60% width) */}
        <div className="product-panel col-span-7 h-full">
          <div className="panel-tabs mb-4">
            <div className="flex border-b border-muted">
              <button
                onClick={() => setActiveTab('search')}
                className={`tab-button px-6 py-3 font-medium transition-colors ${
                  activeTab === 'search'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted hover:text-text'
                }`}
              >
                Product Search
              </button>
              <button
                onClick={() => setActiveTab('checkout')}
                className={`tab-button px-6 py-3 font-medium transition-colors ${
                  activeTab === 'checkout'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted hover:text-text'
                }`}
              >
                Checkout
              </button>
            </div>
          </div>

          <div className="panel-content h-full">
            {activeTab === 'search' ? (
              <ProductSearch />
            ) : (
              <Checkout onTransactionComplete={() => setActiveTab('search')} />
            )}
          </div>
        </div>

        {/* Right Panel - Cart (40% width) */}
        <div className="cart-panel col-span-5 h-full">
          <Cart />
        </div>
      </div>
    </div>
  );
}
