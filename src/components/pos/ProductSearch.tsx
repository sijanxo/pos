'use client';

import { useState, useEffect } from 'react';
import { Search, Scan, Package } from 'lucide-react';
import { Input, Card, CardContent } from '@/components/shared';
import { usePOSStore } from '@/stores/posStore';
import { Product } from '@/types';
import { formatCurrency, debounce } from '@/utils';

export function ProductSearch() {
  const {
    searchQuery,
    searchResults,
    isLoading,
    selectedProduct,
    searchProducts,
    setSelectedProduct,
    addToCart,
    clearSearch,
  } = usePOSStore();

  const [localQuery, setLocalQuery] = useState(searchQuery);

  // Debounced search to avoid too many API calls
  const debouncedSearch = debounce(searchProducts, 300);

  useEffect(() => {
    debouncedSearch(localQuery);
  }, [localQuery, debouncedSearch]);

  // Initialize with popular products on mount
  useEffect(() => {
    if (!searchQuery && searchResults.length === 0) {
      searchProducts('');
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalQuery(value);
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    addToCart(product, quantity);
    setSelectedProduct(null);
    // Optional: Clear search after adding to cart for faster workflow
    // setLocalQuery('');
  };

  const handleBarcodeInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle barcode scanner input (usually ends with Enter)
    if (e.key === 'Enter' && localQuery.match(/^\d{8,13}$/)) {
      const product = searchResults.find(p => p.barcode === localQuery);
      if (product) {
        handleAddToCart(product);
        setLocalQuery('');
      }
    }
  };

  return (
    <div className="product-search h-full flex flex-col">
      {/* Search Input */}
      <div className="search-input-section mb-4">
        <Input
          type="text"
          placeholder="Search products by name, brand, SKU, or scan barcode..."
          value={localQuery}
          onChange={handleInputChange}
          onKeyDown={handleBarcodeInput}
          leftIcon={<Search size={20} />}
          rightIcon={<Scan size={20} />}
          fullWidth
          className="text-lg"
        />
        
        {localQuery && (
          <div className="search-meta mt-2 flex items-center justify-between text-sm text-muted">
            <span>
              {isLoading ? 'Searching...' : `${searchResults.length} products found`}
            </span>
            <button
              onClick={() => {
                setLocalQuery('');
                clearSearch();
              }}
              className="text-primary hover:text-primary-hover"
            >
              Clear search
            </button>
          </div>
        )}
      </div>

      {/* Product Results */}
      <div className="product-results flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="loading-state flex-center h-32">
            <div className="spinner" />
            <span className="ml-2 text-muted">Searching products...</span>
          </div>
        ) : (
          <div className="product-grid">
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {searchResults.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isSelected={selectedProduct?.id === product.id}
                    onSelect={handleProductSelect}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="no-results flex-center h-32 text-center">
                <div>
                  <Package size={48} className="mx-auto text-muted mb-2" />
                  <p className="text-muted">
                    {localQuery ? 'No products found' : 'Start typing to search products'}
                  </p>
                  {localQuery && (
                    <p className="text-sm text-muted mt-1">
                      Try searching by product name, brand, or SKU
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
}

function ProductCard({ product, isSelected, onSelect, onAddToCart }: ProductCardProps) {
  const isLowStock = product.stockQuantity <= product.minStockLevel;
  const isOutOfStock = product.stockQuantity === 0;

  return (
    <Card
      className={`product-card cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'ring-2 ring-primary' : ''
      } ${isOutOfStock ? 'opacity-50' : ''}`}
      onClick={() => onSelect(product)}
      padding="sm"
    >
      <div className="flex items-center gap-3">
        {/* Product Image Placeholder */}
        <div className="product-image w-12 h-12 bg-gray-100 rounded flex-center flex-shrink-0">
          <Package size={24} className="text-gray-400" />
        </div>

        {/* Product Info */}
        <div className="product-info flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="product-name font-medium text-text truncate">
                {product.name}
              </h3>
              <p className="product-brand text-sm text-muted">
                {product.brand} • {product.category}
              </p>
              <p className="product-sku text-xs text-muted">
                SKU: {product.sku}
              </p>
            </div>
            
            <div className="product-price-actions text-right flex-shrink-0 ml-2">
              <p className="product-price text-lg font-semibold text-text">
                {formatCurrency(product.price)}
              </p>
              <p className="product-stock text-xs text-muted">
                Stock: {product.stockQuantity}
              </p>
            </div>
          </div>

          {/* Stock Warning */}
          {isLowStock && !isOutOfStock && (
            <div className="stock-warning mt-1">
              <span className="text-xs bg-warning text-white px-2 py-1 rounded">
                Low Stock
              </span>
            </div>
          )}
          
          {isOutOfStock && (
            <div className="stock-warning mt-1">
              <span className="text-xs bg-error text-white px-2 py-1 rounded">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Add to Cart Button */}
        {!isOutOfStock && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="add-to-cart-btn btn btn-primary btn-sm"
          >
            Add
          </button>
        )}
      </div>
    </Card>
  );
}