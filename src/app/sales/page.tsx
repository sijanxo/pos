'use client';

import { useState } from 'react';
import { User, Search, Plus, Minus } from 'lucide-react';
import { usePOSStore } from '@/stores/posStore';
import { useAuthStore } from '@/stores/authStore';
import { formatCurrency } from '@/utils';
import { Product } from '@/types';

export default function Sales() {
  const { user, logout } = useAuthStore();
  const {
    cart,
    searchQuery,
    searchResults,
    isLoading,
    searchProducts,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
  } = usePOSStore();

  const [searchInput, setSearchInput] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    searchProducts(value);
  };

  const handleProductSelect = (product: Product) => {
    addToCart(product, 1);
    setSearchInput(''); // Clear search after adding
  };

  const handleQuantityChange = (itemId: string, change: number) => {
    const item = cart.items.find(i => i.id === itemId);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity > 0) {
        updateCartItemQuantity(itemId, newQuantity);
      } else {
        removeFromCart(itemId);
      }
    }
  };

  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="sales-page h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="header bg-card border-b border-muted px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-text">sales</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted">{user?.username}</span>
          <User size={24} className="text-muted" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Search Bar */}
          <div className="search-section mb-6 relative">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchInput}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-3 border border-muted rounded-lg bg-card text-text focus:border-primary focus:outline-none"
              />
            </div>
            
            {/* Search Results Dropdown */}
            {searchInput && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-muted rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                {searchResults.slice(0, 10).map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleProductSelect(product)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 focus:bg-gray-50 focus:outline-none"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-text">{product.name}</div>
                        <div className="text-sm text-muted">{product.brand} • {product.sku}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-text">{formatCurrency(product.price)}</div>
                        <div className="text-xs text-muted">Stock: {product.stockQuantity}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Items Table */}
          <div className="items-table bg-card border border-muted rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="table-header bg-gray-50 border-b border-muted">
              <div className="grid grid-cols-12 gap-4 px-4 py-3 text-sm font-medium text-muted">
                <div className="col-span-1">qty</div>
                <div className="col-span-2">sku</div>
                <div className="col-span-4">name</div>
                <div className="col-span-2">unit price</div>
                <div className="col-span-1">+</div>
                <div className="col-span-1">-</div>
                <div className="col-span-1">price</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="table-body">
              {cart.items.length === 0 ? (
                <div className="text-center py-12 text-muted">
                  <div className="text-lg mb-2">No items in cart</div>
                  <div className="text-sm">Search and add products to get started</div>
                </div>
              ) : (
                cart.items.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-4 px-4 py-4 border-b border-gray-100 last:border-b-0 items-center">
                    <div className="col-span-1 text-center font-mono">
                      {item.quantity}
                    </div>
                    <div className="col-span-2 text-sm font-mono text-muted">
                      {item.product.sku}
                    </div>
                    <div className="col-span-4">
                      <div className="font-medium text-text">{item.product.name}</div>
                      <div className="text-sm text-muted">{item.product.brand}</div>
                    </div>
                    <div className="col-span-2 font-mono">
                      {formatCurrency(item.unitPrice)}
                    </div>
                    <div className="col-span-1">
                      <button
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <div className="col-span-1">
                      <button
                        onClick={() => handleQuantityChange(item.id, -1)}
                        className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <Minus size={16} />
                      </button>
                    </div>
                    <div className="col-span-1 font-mono font-semibold">
                      {formatCurrency(item.totalPrice)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Bottom Section */}
          <div className="bottom-section mt-6 flex justify-between items-end">
            <div className="item-count">
              <span className="text-2xl font-mono">{totalItems}</span>
            </div>
            
            <div className="total-and-pay flex items-end gap-4">
              <div className="total text-right">
                <div className="text-lg font-semibold">
                  Total {formatCurrency(cart.total)}
                </div>
                {cart.tax > 0 && (
                  <div className="text-sm text-muted">
                    Tax: {formatCurrency(cart.tax)}
                  </div>
                )}
              </div>
              
              <button
                disabled={cart.items.length === 0}
                className="pay-button bg-secondary text-white px-8 py-3 rounded-lg font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary-hover focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                pay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
