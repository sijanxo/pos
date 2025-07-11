'use client';

import { useState } from 'react';
import { CreditCard, DollarSign, Receipt, Check } from 'lucide-react';
import { Button, Card, CardHeader, CardContent, Input } from '@/components/shared';
import { usePOSStore } from '@/stores/posStore';
import { useAddSale } from '@/stores/salesStore';
import { formatCurrency, toCents, fromCents } from '@/utils';
import { CartItem } from '@/types';

interface CheckoutProps {
  onTransactionComplete?: () => void;
}

export function Checkout({ onTransactionComplete }: CheckoutProps) {
  const { cart, processTransaction } = usePOSStore();
  const addSale = useAddSale();
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [cashReceived, setCashReceived] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<any>(null);

  const isEmpty = cart.items.length === 0;
  const cashAmount = parseFloat(cashReceived) || 0;
  const cashAmountInCents = cashAmount > 0 ? toCents(cashAmount) : 0;
  const changeInCents = paymentMethod === 'cash' && cashAmountInCents > cart.total ? 
    cashAmountInCents - cart.total : 0;
  const isValidCashPayment = paymentMethod !== 'cash' || cashAmountInCents >= cart.total;

  const handleQuickCash = (amountInCents: number) => {
    if (paymentMethod === 'cash') {
      setCashReceived(fromCents(amountInCents).toFixed(2));
    }
  };

  const handleProcessPayment = async () => {
    if (isEmpty || !isValidCashPayment) return;

    setIsProcessing(true);
    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const transaction = processTransaction(
        paymentMethod,
        paymentMethod === 'cash' ? cashAmount : undefined
      );

      // ========== SALE RECORDING LOGIC ==========
      // After successful payment, record the sale
      
      // Generate unique sale ID
      const saleId = Date.now().toString() + Math.random().toString(36).substring(2, 9);
      
      // Handle payment method mapping (split payments mapped to cash for simplicity)
      const mappedPaymentMethod: 'cash' | 'card' = 
        transaction.paymentMethod === 'split' ? 'cash' : transaction.paymentMethod;
      
      // Construct comprehensive saleData object (all values in cents)
      const saleData = {
        id: saleId,
        saleDate: new Date().toISOString(),
        totalAmount: transaction.total, // already in cents
        taxAmount: transaction.tax, // already in cents
        discountAmount: transaction.discount, // already in cents
        paymentMethod: mappedPaymentMethod,
        cashierId: transaction.cashierId || 'mock_cashier_123',
        isRefund: false,
        originalSaleId: null,
        changeGiven: transaction.changeGiven || 0, // already in cents
        items: transaction.items.map((item: CartItem) => ({
          productId: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          priceAtSale: item.unitPrice, // already in cents
          costAtSale: toCents(item.product.cost), // convert cost to cents
          appliedDiscount: 0, // Individual item discounts not implemented yet
          finalLineTotal: item.totalPrice, // already in cents
        })),
      };

      // Save the sale to sales history
      addSale(saleData);
      // ========== END SALE RECORDING LOGIC ==========
      
      setLastTransaction(transaction);
      setShowReceipt(true);
      setCashReceived('');
      
      onTransactionComplete?.();
    } catch (error) {
      console.error('Transaction failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Generate quick cash amounts based on total (all in cents)
  const quickCashAmountsInCents = [
    cart.total,
    Math.ceil(fromCents(cart.total) / 5) * 500,  // Round up to nearest $5 (in cents)
    Math.ceil(fromCents(cart.total) / 10) * 1000, // Round up to nearest $10 (in cents)
    Math.ceil(fromCents(cart.total) / 20) * 2000, // Round up to nearest $20 (in cents)
  ].filter((amount, index, arr) => arr.indexOf(amount) === index); // Remove duplicates

  if (showReceipt && lastTransaction) {
    return (
      <ReceiptView
        transaction={lastTransaction}
        onClose={() => {
          setShowReceipt(false);
          setLastTransaction(null);
        }}
      />
    );
  }

  return (
    <div className="checkout h-full flex flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader
          title="Checkout"
          subtitle={isEmpty ? 'No items to checkout' : `${cart.items.length} items`}
        />

        <CardContent className="flex-1 flex flex-col">
          {isEmpty ? (
            <div className="empty-checkout flex-center flex-1 text-center">
              <div>
                <Receipt size={48} className="mx-auto text-muted mb-3" />
                <p className="text-muted">Add items to cart to proceed with checkout</p>
              </div>
            </div>
          ) : (
            <div className="checkout-content flex-1 flex flex-col gap-6">
              {/* Order Summary */}
              <div className="order-summary">
                <h3 className="text-lg font-semibold mb-3">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    {/* All cart values are in cents */}
                    <span>{formatCurrency(cart.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>{formatCurrency(cart.tax)}</span>
                  </div>
                  {cart.discount > 0 && (
                    <div className="flex justify-between text-success">
                      <span>Discount:</span>
                      <span>-{formatCurrency(cart.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-bold border-t pt-2">
                    <span>Total:</span>
                    <span className="text-primary">{formatCurrency(cart.total)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="payment-method">
                <h3 className="text-lg font-semibold mb-3">Payment Method</h3>
                <div className="payment-options grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethod('cash')}
                    className={`payment-option p-4 border-2 rounded-lg transition-all ${
                      paymentMethod === 'cash'
                        ? 'border-primary bg-primary bg-opacity-10'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <DollarSign size={24} className="mx-auto mb-2" />
                    <span className="block font-medium">Cash</span>
                  </button>
                  
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`payment-option p-4 border-2 rounded-lg transition-all ${
                      paymentMethod === 'card'
                        ? 'border-primary bg-primary bg-opacity-10'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <CreditCard size={24} className="mx-auto mb-2" />
                    <span className="block font-medium">Card</span>
                  </button>
                </div>
              </div>

              {/* Cash Payment Details */}
              {paymentMethod === 'cash' && (
                <div className="cash-payment">
                  <h3 className="text-lg font-semibold mb-3">Cash Payment</h3>
                  
                  {/* Quick Cash Buttons */}
                  <div className="quick-cash mb-4">
                    <p className="text-sm text-muted mb-2">Quick amounts:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {quickCashAmountsInCents.slice(0, 4).map((amountInCents) => (
                        <Button
                          key={amountInCents}
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQuickCash(amountInCents)}
                        >
                          {formatCurrency(amountInCents)}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Cash Received Input */}
                  <Input
                    type="number"
                    label="Cash Received"
                    placeholder="0.00"
                    value={cashReceived}
                    onChange={(e) => setCashReceived(e.target.value)}
                    step="0.01"
                    min="0"
                    fullWidth
                  />

                  {/* Change Calculation */}
                  {cashAmountInCents > 0 && (
                    <div className="change-info mt-3 p-3 bg-gray-50 rounded">
                      {cashAmountInCents >= cart.total ? (
                        <div className="change-display">
                          <div className="flex justify-between text-lg font-semibold">
                            <span>Change:</span>
                            <span className="text-success">
                              {formatCurrency(changeInCents)}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="insufficient-cash text-error">
                          <p>Insufficient cash received</p>
                          <p className="text-sm">
                            Need {formatCurrency(cart.total - cashAmountInCents)} more
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Process Payment Button */}
              <div className="payment-action mt-auto">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleProcessPayment}
                  disabled={!isValidCashPayment || isProcessing}
                  loading={isProcessing}
                  leftIcon={paymentMethod === 'cash' ? <DollarSign /> : <CreditCard />}
                  className="w-full"
                >
                  {isProcessing
                    ? 'Processing...'
                    : `Process ${paymentMethod === 'cash' ? 'Cash' : 'Card'} Payment`}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface ReceiptViewProps {
  transaction: any; // Use the Transaction type from your types
  onClose: () => void;
}

function ReceiptView({ transaction, onClose }: ReceiptViewProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="receipt-view h-full flex flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader
          title="Transaction Complete"
          action={
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          }
        />

        <CardContent className="flex-1 flex flex-col">
          <div className="success-message text-center mb-6">
            <div className="success-icon w-16 h-16 bg-success rounded-full flex-center mx-auto mb-3">
              <Check size={32} className="text-white" />
            </div>
            <h2 className="text-xl font-semibold text-success mb-1">
              Payment Successful!
            </h2>
            <p className="text-muted">
              Transaction ID: {transaction.id}
            </p>
          </div>

          {/* Receipt */}
          <div className="receipt bg-white border p-6 rounded-lg mb-4 receipt">
            <div className="receipt-header text-center mb-4">
              <h3 className="text-lg font-bold">Premium Liquor Store</h3>
              <p className="text-sm text-muted">123 Main Street, Anytown, USA</p>
              <p className="text-sm text-muted">
                {new Date(transaction.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="receipt-items mb-4">
              {transaction.items.map((item: any, index: number) => (
                <div key={index} className="receipt-item flex justify-between text-sm mb-1">
                  <div className="flex-1">
                    <div>{item.product.name}</div>
                    <div className="text-muted">
                      {/* item.unitPrice and item.totalPrice are in cents */}
                      {item.quantity} x {formatCurrency(item.unitPrice)}
                    </div>
                  </div>
                  <div>{formatCurrency(item.totalPrice)}</div>
                </div>
              ))}
            </div>

            <div className="receipt-totals border-t pt-2 space-y-1">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                {/* All transaction values are in cents */}
                <span>{formatCurrency(transaction.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax:</span>
                <span>{formatCurrency(transaction.tax)}</span>
              </div>
              {transaction.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Discount:</span>
                  <span>-{formatCurrency(transaction.discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold border-t pt-1">
                <span>Total:</span>
                <span>{formatCurrency(transaction.total)}</span>
              </div>
              
              <div className="payment-info mt-2 pt-2 border-t">
                <div className="flex justify-between text-sm">
                  <span>Payment Method:</span>
                  <span className="capitalize">{transaction.paymentMethod}</span>
                </div>
                {transaction.cashReceived && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span>Cash Received:</span>
                      {/* cashReceived is in cents */}
                      <span>{formatCurrency(transaction.cashReceived)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Change:</span>
                      {/* changeGiven is in cents */}
                      <span>{formatCurrency(transaction.changeGiven || 0)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="receipt-footer text-center mt-4 text-xs text-muted">
              <p>Thank you for your business!</p>
              <p>Please drink responsibly.</p>
            </div>
          </div>

          {/* Actions */}
          <div className="receipt-actions grid grid-cols-2 gap-3 no-print">
            <Button variant="ghost" onClick={handlePrint} leftIcon={<Receipt />}>
              Print Receipt
            </Button>
            <Button variant="primary" onClick={onClose}>
              New Sale
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}