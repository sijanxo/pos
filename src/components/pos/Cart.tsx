'use client';

import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { Button, Card, CardHeader, CardContent } from '@/components/shared';
import { usePOSStore } from '@/stores/posStore';
import { CartItem, Cart as CartType } from '@/types';
import { formatCurrency } from '@/utils';

export function Cart() {
  const {
    cart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    applyDiscount,
  } = usePOSStore();

  const isEmpty = cart.items.length === 0;

  const handleQuantityChange = (itemId: string, change: number) => {
    const item = cart.items.find(i => i.id === itemId);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity > 0) {
        updateCartItemQuantity(itemId, newQuantity);
      }
    }
  };

  const handleDirectQuantityChange = (itemId: string, quantity: string) => {
    const numQuantity = parseInt(quantity, 10);
    if (!isNaN(numQuantity) && numQuantity >= 0) {
      updateCartItemQuantity(itemId, numQuantity);
    }
  };

  return (
    <div className="cart h-full flex flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader
          title="Current Sale"
          subtitle={`${cart.items.length} item${cart.items.length !== 1 ? 's' : ''}`}
          action={
            !isEmpty && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCart}
                leftIcon={<Trash2 size={16} />}
              >
                Clear
              </Button>
            )
          }
        />

        <CardContent className="flex-1 flex flex-col p-0">
          {isEmpty ? (
            <div className="empty-cart flex-center flex-1 text-center p-6">
              <div>
                <ShoppingCart size={48} className="mx-auto text-muted mb-3" />
                <p className="text-muted text-lg">Cart is empty</p>
                <p className="text-sm text-muted mt-1">
                  Search and add products to start a sale
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="cart-items flex-1 overflow-y-auto px-4">
                <div className="space-y-2">
                  {cart.items.map((item) => (
                    <CartItemCard
                      key={item.id}
                      item={item}
                      onQuantityChange={handleQuantityChange}
                      onDirectQuantityChange={handleDirectQuantityChange}
                      onRemove={removeFromCart}
                    />
                  ))}
                </div>
              </div>

              {/* Cart Totals */}
              <div className="cart-totals border-t border-muted p-4 bg-gray-50">
                <CartTotals cart={cart} />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface CartItemCardProps {
  item: CartItem;
  onQuantityChange: (itemId: string, change: number) => void;
  onDirectQuantityChange: (itemId: string, quantity: string) => void;
  onRemove: (itemId: string) => void;
}

function CartItemCard({
  item,
  onQuantityChange,
  onDirectQuantityChange,
  onRemove,
}: CartItemCardProps) {
  return (
    <div className="cart-item bg-white border border-gray-200 rounded-lg p-3">
      <div className="flex items-start gap-3">
        {/* Product Info */}
        <div className="product-info flex-1 min-w-0">
          <h4 className="product-name font-medium text-text truncate">
            {item.product.name}
          </h4>
          <p className="product-brand text-sm text-muted">
            {item.product.brand}
          </p>
          <p className="product-price text-sm text-muted">
            {/* unitPrice is stored in cents, so we use formatCurrency directly */}
            {formatCurrency(item.unitPrice)} each
          </p>
        </div>

        {/* Quantity Controls */}
        <div className="quantity-controls flex items-center gap-2">
          <button
            onClick={() => onQuantityChange(item.id, -1)}
            className="quantity-btn w-8 h-8 rounded border border-gray-300 flex-center hover:bg-gray-50"
            disabled={item.quantity <= 1}
          >
            <Minus size={14} />
          </button>
          
          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) => onDirectQuantityChange(item.id, e.target.value)}
            className="quantity-input w-16 h-8 text-center border border-gray-300 rounded"
          />
          
          <button
            onClick={() => onQuantityChange(item.id, 1)}
            className="quantity-btn w-8 h-8 rounded border border-gray-300 flex-center hover:bg-gray-50"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Item Total */}
        <div className="item-total text-right min-w-0">
          <p className="font-semibold text-text">
            {/* totalPrice is stored in cents, so we use formatCurrency directly */}
            {formatCurrency(item.totalPrice)}
          </p>
          <button
            onClick={() => onRemove(item.id)}
            className="remove-btn text-error hover:text-red-700 text-sm mt-1"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

interface CartTotalsProps {
  cart: CartType;
}

function CartTotals({ cart }: CartTotalsProps) {
  return (
    <div className="cart-totals-section space-y-2">
      {/* Subtotal */}
      <div className="flex justify-between text-sm">
        <span className="text-muted">Subtotal:</span>
        {/* All cart values are stored in cents */}
        <span className="font-medium">{formatCurrency(cart.subtotal)}</span>
      </div>

      {/* Tax */}
      <div className="flex justify-between text-sm">
        <span className="text-muted">Tax:</span>
        <span className="font-medium">{formatCurrency(cart.tax)}</span>
      </div>

      {/* Discount */}
      {cart.discount > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-muted">Discount:</span>
          <span className="font-medium text-success">
            {cart.discountPercentage !== undefined 
              ? `${cart.discountPercentage}% off`
              : `-${formatCurrency(cart.discount)}`
            }
          </span>
        </div>
      )}

      {/* Total */}
      <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-2">
        <span>Total:</span>
        <span className="text-primary">{formatCurrency(cart.total)}</span>
      </div>

      {/* Item Count */}
      <div className="text-center text-sm text-muted">
        {cart.items.reduce((sum, item) => sum + item.quantity, 0)} items
      </div>
    </div>
  );
}