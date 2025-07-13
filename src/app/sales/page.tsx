'use client'

import { useEffect, useState } from 'react'

import { Search, Plus, Minus, Trash2Icon } from 'lucide-react'

// Constants for configuration
const STORE_CONFIG = {
  name: 'Premium Liquor Store',
  address: '123 Main Street, Anytown, USA',
  phone: '(555) 123-4567',
  defaultCashierId: 'CASHIER-001',
  defaultTaxRate: 8.5, // 8.5%
  defaultMarkupPercentage: 40, // 40% markup (60% cost ratio)
} as const
import { toCents, fromCents, formatCurrency, calculateDiscountAmount, generateId, calculateTax } from '@/utils'
import { useCartStore, CartItem } from '@/stores/cartStore'
import { Product } from '@/types'
import { useSalesStore, SaleData } from '@/stores/salesStore'
import { PaymentConfirmedModal } from '@/components/PaymentConfirmedModal'
import { CartItemRow } from '@/components/sales/CartItemRow'
import { SearchResults } from '@/components/sales/SearchResults'
import { printReceipt } from '@/utils/receiptPrinter'
import { mockProducts } from '@/lib/mockData'

export default function Sales() {
  // Using cart store for persistent state
  const {
    searchQuery,
    cartItems,
    cartDiscount,
    isDiscountModalOpen,
    discountModalStep,
    selectedItemForDiscount,
    discountAmount,
    discountType,
    discountReason,
    isCheckoutModalOpen,
    customerPayment,
    customerPaymentInput,
    appliedCashPayment,
    setSearchQuery,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setCartDiscount,
    setItemDiscount,
    setDiscountModalOpen,
    setDiscountModalStep,
    setSelectedItemForDiscount,
    setDiscountAmount,
    setDiscountType,
    setDiscountReason,
    setCheckoutModalOpen,
    setCustomerPayment,
    setCustomerPaymentInput,
    setAppliedCashPayment,
    completeSale,
    cancelSale,
  } = useCartStore();


  // Sales store for saving completed sales
  const { addSale } = useSalesStore();

  // State for PaymentConfirmedModal
  const [showPaymentConfirmedModal, setShowPaymentConfirmedModal] = useState<boolean>(false);
  const [confirmedSaleData, setConfirmedSaleData] = useState<SaleData | null>(null);

  // Missing state variables that were being used but not declared
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'cash' | 'card' | null>(null);



  // Handle print receipt - delegate to utility function
  const handlePrintReceipt = printReceipt;


  // TODO: Replace with actual product search/fetch functionality
  // This is mock data for development purposes
  const [searchResults, setSearchResults] = useState<Product[]>([])
  
  // Mock products for demonstration - should be replaced with real product fetching
//   const mockProducts: Product[] = [
//     {
//       id: '1',
//       sku: 'WN-001',
//       name: 'Cabernet Sauvignon',
//       category: 'Wine',
//       brand: 'Premium Brand',
//       volumeMl: 750,
//       price: 24.99,
//       cost: 18.00,
//       stockQuantity: 25,
//       minStockLevel: 5,
//       isActive: true,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     },
//     {
//       id: '2',
//       sku: 'WN-002',
//       name: 'Chardonnay',
//       category: 'Wine',
//       brand: 'Premium Brand',
//       volumeMl: 750,
//       price: 19.99,
//       cost: 15.00,
//       stockQuantity: 30,
//       minStockLevel: 5,
//       isActive: true,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     },
//     {
//       id: '3',
//       sku: 'WN-003',
//       name: 'Merlot',
//       category: 'Wine',
//       brand: 'Premium Brand',
//       volumeMl: 750,
//       price: 22.99,
//       cost: 17.00,
//       stockQuantity: 20,
//       minStockLevel: 5,
//       isActive: true,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     },
//     {
//       id: '4',
//       sku: 'BR-001',
//       name: 'Craft IPA',
//       category: 'Beer',
//       brand: 'Local Brewery',
//       volumeMl: 500,
//       price: 12.99,
//       cost: 8.00,
//       stockQuantity: 40,
//       minStockLevel: 10,
//       isActive: true,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     },
//     {
//       id: '5',
//       sku: 'BR-002',
//       name: 'Pilsner',
//       category: 'Beer',
//       brand: 'Local Brewery',
//       volumeMl: 330,
//       price: 9.99,
//       cost: 6.00,
//       stockQuantity: 50,
//       minStockLevel: 10,
//       isActive: true,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     },
//     {
//       id: '6',
//       sku: 'SP-001',
//       name: 'Scotch Whisky',
//       category: 'Spirits',
//       brand: 'Aged Spirits Co.',
//       volumeMl: 700,
//       price: 59.99,
//       cost: 45.00,
//       stockQuantity: 15,
//       minStockLevel: 3,
//       isActive: true,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     },
//     {
//       id: '7',
//       sku: 'SP-002',
//       name: 'London Dry Gin',
//       category: 'Spirits',
//       brand: 'Botanical Distillers',
//       volumeMl: 700,
//       price: 34.99,
//       cost: 25.00,
//       stockQuantity: 25,
//       minStockLevel: 5,
//       isActive: true,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     },
//     {
//       id: '8',
//       sku: 'SF-001',
//       name: 'Sparkling Water',
//       category: 'Soft Drinks',
//       brand: 'Aqua Pure',
//       volumeMl: 1000,
//       price: 2.99,
//       cost: 1.50,
//       stockQuantity: 100,
//       minStockLevel: 20,
//       isActive: true,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     },
//     {
//       id: '9',
//       sku: 'SF-002',
//       name: 'Cola Classic',
//       category: 'Soft Drinks',
//       brand: 'Fizz Pop Inc.',
//       volumeMl: 330,
//       price: 1.50,
//       cost: 0.75,
//       stockQuantity: 150,
//       minStockLevel: 30,
//       isActive: true,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     },
//     {
//       id: '10',
//       sku: 'WN-004',
//       name: 'Sauvignon Blanc',
//       category: 'Wine',
//       brand: 'Vineyard Select',
//       volumeMl: 750,
//       price: 21.50,
//       cost: 16.00,
//       stockQuantity: 28,
//       minStockLevel: 5,
//       isActive: true,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     },
//     {
//       id: '11',
//       sku: 'BR-003',
//       name: 'Stout',
//       category: 'Beer',
//       brand: 'Dark Brews Co.',
//       volumeMl: 500,
//       price: 13.50,
//       cost: 8.50,
//       stockQuantity: 35,
//       minStockLevel: 10,
//       isActive: true,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     },
//     {
//       id: '12',
//       sku: 'SP-003',
//       name: 'Caribbean Rum',
//       category: 'Spirits',
//       brand: 'Tropical Distillers',
//       volumeMl: 700,
//       price: 29.99,
//       cost: 20.00,
//       stockQuantity: 20,
//       minStockLevel: 5,
//       isActive: true,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     },
//     {
//       id: '13',
//       sku: 'WN-005',
//       name: 'Rosé',
//       category: 'Wine',
//       brand: 'Summer Vines',
//       volumeMl: 750,
//       price: 18.99,
//       cost: 14.00,
//       stockQuantity: 30,
//       minStockLevel: 5,
//       isActive: true,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     },
//     {
//       id: '14',
//       sku: 'BR-004',
//       name: 'Lager',
//       category: 'Beer',
//       brand: 'Global Beers',
//       volumeMl: 330,
//       price: 8.50,
//       cost: 5.00,
//       stockQuantity: 60,
//       minStockLevel: 15,
//       isActive: true,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     }
// ]

  // Effect to filter products based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const filtered = mockProducts.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.barcode.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setSearchResults(filtered.slice(0, 10)) // Limit to 10 results
  }, [searchQuery])
  const [activeItem, setActiveItem] = useState(0)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!searchQuery) return
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault()
          setActiveItem((prev: number) => prev > 0 ? prev - 1 : searchResults.length - 1)
          break
        case 'ArrowDown':
          e.preventDefault()
          setActiveItem((prev: number) => prev < searchResults.length - 1 ? prev + 1 : 0)
          break
        case 'Enter':
          e.preventDefault()
          if (searchResults[activeItem]) {
            addToCart(searchResults[activeItem])
          }
          break
        default:
          break
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [searchQuery, activeItem, searchResults, addToCart])

  const subtotalAmount = cartItems.reduce(
    (sum: number, item: CartItem) => {
      const itemTotal = item.price * item.quantity
      if (item.discount) {
        if (item.discount.type === 'flat') {
          return sum + Math.max(0, itemTotal - item.discount.amount)
        } else {
          return sum + itemTotal * (1 - item.discount.amount / 100)
        }
      }
      return sum + itemTotal
    },
    0,
  )
  
  const cartDiscountAmount = cartDiscount 
    ? cartDiscount.type === 'flat' 
      ? Math.min(cartDiscount.amount, subtotalAmount) 
      : subtotalAmount * (cartDiscount.amount / 100)
    : 0
    
  const totalAmount = Math.max(0, subtotalAmount - cartDiscountAmount)
  const totalQuantity = cartItems.reduce((sum: number, item: CartItem) => sum + item.quantity, 0)
  const remainingBalance = totalAmount - appliedCashPayment

  // Transaction completion logic - explicit handling for each payment method
  const canCompleteTransaction = (() => {
    if (cartItems.length === 0) return false;
    if (!selectedPaymentMethod) return false;
    
    // For cash payments, require sufficient payment to cover the total
    if (selectedPaymentMethod === 'cash') {
      return remainingBalance <= 0;
    }
    
    // For card payments, no balance validation needed - external terminal handles payment
    if (selectedPaymentMethod === 'card') {
      return true;
    }
    
    return false;
  })();

  // Enhanced complete sale function with sales recording
  const handleCompleteSale = () => {
    // Use the new completion logic
    if (!canCompleteTransaction) {
      console.warn("Transaction cannot be completed based on current payment state.");
      return;
    }

    // Ensure we have a valid payment method
    if (!selectedPaymentMethod) {
      console.error("No payment method selected");
      alert('Please select a payment method before completing the transaction.');
      return;
    }

    try {
      // Generate unique sale ID
      const saleId = Date.now().toString() + Math.random().toString(36).substring(2, 9);
      
      // Calculate values in cents for accurate storage
      const subtotalInCents = toCents(subtotalAmount);
      const taxInCents = calculateTax(subtotalInCents, STORE_CONFIG.defaultTaxRate);
      const discountInCents = toCents(cartDiscountAmount);
      const totalInCents = toCents(totalAmount);
      const changeGivenInCents = selectedPaymentMethod === 'cash' ? toCents(appliedCashPayment - totalAmount) : 0;
      
      // Use the selected payment method explicitly to prevent misclassification
      const paymentMethod = selectedPaymentMethod;
      
      // Construct comprehensive saleData object
      const saleData: SaleData = {
        id: saleId,
        saleDate: new Date().toISOString(),
        totalAmount: totalInCents, // in cents
        taxAmount: taxInCents, // in cents
        discountAmount: discountInCents, // in cents
        paymentMethod,
        cashierId: STORE_CONFIG.defaultCashierId,
        isRefund: false,
        originalSaleId: null,
        changeGiven: paymentMethod === 'cash' ? changeGivenInCents : 0, // in cents
        items: cartItems.map((item: CartItem) => {
          // Calculate item-level values
          const itemSubtotal = item.price * item.quantity;
          const itemDiscountAmount = item.discount 
            ? (item.discount.type === 'flat' 
                ? Math.min(item.discount.amount, itemSubtotal)
                : itemSubtotal * (item.discount.amount / 100))
            : 0;
          const finalLineTotal = itemSubtotal - itemDiscountAmount;
          
          return {
            productId: item.id,
            name: item.name,
            quantity: item.quantity,
            priceAtSale: toCents(item.price), // in cents
            costAtSale: toCents(item.cost || item.price * (100 - STORE_CONFIG.defaultMarkupPercentage) / 100), // mock cost if not available, in cents
            appliedDiscount: toCents(itemDiscountAmount), // in cents
            finalLineTotal: toCents(finalLineTotal), // in cents
          };
        }),
      };

      // Record the sale to sales history
      addSale(saleData);

      // Clear cart and reset payment state
      completeSale();

      // Reset payment method selection
      setSelectedPaymentMethod(null);

      // Show payment confirmation modal
      setConfirmedSaleData(saleData);
      setShowPaymentConfirmedModal(true);

      // Close the checkout modal
      setCheckoutModalOpen(false);
    } catch (error) {
      console.error('Failed to complete sale:', error);
      alert('Failed to complete sale. Please try again.');
    }
  };

  const generateCashAmounts = (): number[] => {
    const amounts: number[] = []
    const total = remainingBalance
    
    if (total <= 0) {
      return [1, 2, 5, 10, 20, 50, 100, 200, 500]
    }
    
    amounts.push(total)
    
    const commonBills = [1, 2, 5, 10, 20, 50, 100, 200, 500]
    commonBills.forEach(bill => {
      if (bill >= total && !amounts.includes(bill)) {
        amounts.push(bill)
      }
    })
    
    const roundedAmounts = [
      Math.ceil(total / 5) * 5,
      Math.ceil(total / 10) * 10,
      Math.ceil(total / 20) * 20,
      Math.ceil(total / 50) * 50,
      Math.ceil(total / 100) * 100
    ]
    
    roundedAmounts.forEach(amount => {
      if (amount > total && !amounts.includes(amount)) {
        amounts.push(amount)
      }
    })
    
    const additionalAmounts = [25, 30, 40, 75, 150, 250, 300, 400, 600, 750, 1000]
    additionalAmounts.forEach(amount => {
      if (amount > total && !amounts.includes(amount) && amounts.length < 12) {
        amounts.push(amount)
      }
    })
    
    const sortedAmounts = amounts.sort((a, b) => a - b)
    
    while (sortedAmounts.length < 9) {
      const lastAmount = sortedAmounts[sortedAmounts.length - 1] || 1
      const increment = lastAmount >= 100 ? 100 : lastAmount >= 50 ? 50 : 10
      const nextAmount = lastAmount + increment
      if (!sortedAmounts.includes(nextAmount)) {
        sortedAmounts.push(nextAmount)
      } else {
        sortedAmounts.push(nextAmount + increment)
      }
    }
    
    return sortedAmounts.slice(0, 9)
  }

  return (
    <div className="flex flex-col w-full h-screen bg-gray-900 text-gray-100 relative">
      <div className="flex-1 overflow-hidden flex flex-col p-4 pb-[160px]">
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search"
            className="w-full p-3 pl-10 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-amber-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        </div>

        <SearchResults
          searchQuery={searchQuery}
          searchResults={searchResults}
          activeItem={activeItem}
          onAddToCart={addToCart}
          onSetActiveItem={setActiveItem}
        />

        <div className="flex-1 overflow-auto">
          <h2 className="text-lg font-medium mb-2 text-gray-300">Cart Items</h2>
          {cartItems.length > 0 ? (
            <div className="space-y-2">
              <div className="p-3 bg-gray-700 rounded-lg flex justify-between items-center font-medium text-gray-300 text-sm">
                <div className="flex items-center gap-4">
                  <span className="w-[104px] text-center">Quantity</span>
                  <span className="w-20">SKU</span>
                  <span className="flex-1">Name</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-24 text-right">Unit Price</span>
                  <span className="w-24 text-right mr-6">Total Price</span>
                  <span className="w-6"></span>
                </div>
              </div>
              {cartItems.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemoveFromCart={removeFromCart}
                  onRemoveDiscount={(itemId) => setItemDiscount(itemId, undefined)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">No items in cart</div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4 border-t border-gray-700 z-10">
        <div className="mb-3">
          <div className="flex justify-between items-center mb-2">
            <div className="text-gray-300">
              <span className="font-medium mr-2">Total Items:</span>
              <span className="text-xl">{totalQuantity}</span>
            </div>
            <div className="text-right">
              <div className="text-gray-300 text-sm">Subtotal: {formatCurrency(toCents(subtotalAmount))}</div>
                                             {cartDiscount && (
                  <div className="text-green-400 text-sm flex items-center justify-end gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                        {cartDiscount.type === 'flat' 
                          ? `${formatCurrency(toCents(Math.min(cartDiscount.amount, subtotalAmount)))} off total` 
                          : `${cartDiscount.amount}% off`}
                      </span>
                      <span>Cart Discount: -{formatCurrency(toCents(cartDiscountAmount))}
                        {cartDiscount.reason && <span className="text-gray-400"> ({cartDiscount.reason})</span>}
                      </span>
                    </div>
                    <button
                      className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded"
                      onClick={() => setCartDiscount(null)}
                    >
                      Clear
                    </button>
                  </div>
                )}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xl">Total</span>
            <span className="text-2xl font-bold">{formatCurrency(toCents(totalAmount))}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xl transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
            disabled={cartItems.length === 0}
            onClick={() => {
              setDiscountModalStep('initial')
              setDiscountAmount('')
              setDiscountType('flat')
              setDiscountReason('')
              setSelectedItemForDiscount(null)
              setDiscountModalOpen(true)
            }}
          >
            Apply Discount
          </button>
          <button 
            className="flex-1 py-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xl transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
            disabled={cartItems.length === 0}
            onClick={() => {
              setCustomerPayment(0)
              setCustomerPaymentInput('')
              setAppliedCashPayment(0)
              setSelectedPaymentMethod(null)
              setCheckoutModalOpen(true)
            }}
          >
            Pay
          </button>
        </div>
        <div className="flex gap-2 mt-2">
          <button 
            className="flex-1 py-2 bg-gray-600 hover:bg-gray-500 text-white font-medium rounded-lg text-sm transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
            disabled={cartItems.length === 0}
            onClick={() => {
              if (window.confirm('Are you sure you want to clear the cart? This will remove all items.')) {
                clearCart()
              }
            }}
          >
            Clear Cart
          </button>
          <button 
            className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg text-sm transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
            disabled={cartItems.length === 0}
            onClick={() => {
              if (window.confirm('Are you sure you want to cancel this sale? This will clear the cart and reset all payment information.')) {
                cancelSale()
              }
            }}
          >
            Cancel Sale
          </button>
        </div>
      </div>

      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => {
              // Click outside modal to return to cart
              setCustomerPayment(0)
              setCustomerPaymentInput('')
              setAppliedCashPayment(0)
              setSelectedPaymentMethod(null)
              setCheckoutModalOpen(false)
            }}
          ></div>
          
          <div className="relative bg-white rounded-lg p-4 mx-4 w-full max-w-2xl h-[520px] border-2 border-blue-500 flex flex-col">
            <h2 className="text-xl font-bold mb-4 text-black">payment</h2>

            <div className="flex-shrink-0 mb-3">
              <div className="mb-3 p-2 bg-gray-50 rounded">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-black font-medium text-sm">Original Total</span>
                  <span className="text-black font-bold">{formatCurrency(toCents(totalAmount))}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-black font-medium text-sm">Quantity</span>
                  <span className="text-black font-bold">{totalQuantity}</span>
                </div>
              </div>

              <div className="mb-3 h-10">
                {appliedCashPayment > 0 ? (
                  <div className="p-2 bg-green-100 border border-green-300 rounded">
                    <div className="flex justify-between items-center">
                      <span className="text-black font-medium">Cash Payment Applied</span>
                      <div className="flex items-center gap-2">
                        <span className="text-green-700 font-bold">-{formatCurrency(toCents(appliedCashPayment))}</span>
                        <button
                          className="px-2 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded"
                          onClick={() => setAppliedCashPayment(0)}
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full"></div>
                )}
              </div>

              {/* Payment Method Selection */}
              <div className="mb-3 p-2 bg-gray-50 rounded">
                <div className="text-black font-medium text-sm mb-2">Payment Method</div>
                <div className="flex gap-2">
                  <button
                    className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
                      selectedPaymentMethod === 'cash'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-black'
                    }`}
                    onClick={() => setSelectedPaymentMethod('cash')}
                  >
                    Cash
                  </button>
                  <button
                    className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
                      selectedPaymentMethod === 'card'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-black'
                    }`}
                    onClick={() => setSelectedPaymentMethod('card')}
                  >
                    Card
                  </button>
                </div>
              </div>

              <div className={`mb-3 p-2 rounded ${canCompleteTransaction ? 'bg-green-50 border border-green-300' : 'bg-blue-50 border border-blue-300'}`}>
                <div className="flex justify-between items-center">
                  <span className={`font-medium ${canCompleteTransaction ? 'text-green-700' : 'text-black'}`}>
                    {selectedPaymentMethod === 'cash' 
                      ? (remainingBalance <= 0 ? 'Order Paid In Full' : 'Remaining Balance')
                      : selectedPaymentMethod === 'card'
                      ? 'Ready for Card Payment'
                      : 'Select Payment Method'}
                  </span>
                  <span className={`font-bold text-lg ${canCompleteTransaction ? 'text-green-700' : 'text-blue-700'}`}>
                    {selectedPaymentMethod === 'cash' 
                      ? (remainingBalance <= 0 ? formatCurrency(0) : formatCurrency(toCents(remainingBalance)))
                      : selectedPaymentMethod === 'card'
                      ? formatCurrency(toCents(totalAmount))
                      : formatCurrency(toCents(totalAmount))}
                  </span>
                </div>
                <div className="h-12 mt-2">
                  {canCompleteTransaction ? (
                    <button
                      className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded"
                      onClick={() => {
                        handleCompleteSale()
                      }}
                    >
                      Complete Transaction
                    </button>
                  ) : (
                    <div className="h-full"></div>
                  )}
                </div>
              </div>

              <div className="mb-3 h-20">
                {selectedPaymentMethod === 'cash' && remainingBalance > 0 ? (
                  <div className="p-2 bg-gray-100 rounded h-full">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-black font-medium text-sm">Customer Payment</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">$</span>
                        <input
                          type="text"
                          value={customerPaymentInput}
                          onChange={(e) => {
                            const value = e.target.value
                            const regex = /^\d*\.?\d{0,2}$/
                            if (regex.test(value) || value === '') {
                              setCustomerPaymentInput(value)
                              setCustomerPayment(parseFloat(value) || 0)
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && customerPayment > 0) {
                              setAppliedCashPayment(appliedCashPayment + customerPayment)
                              setCustomerPayment(0)
                              setCustomerPaymentInput('')
                              return
                            }
                            
                            if (['Backspace', 'Delete', 'Tab', 'Escape', 'Enter'].includes(e.key)) {
                              return
                            }
                            
                            if (e.key === '.' && !customerPaymentInput.includes('.')) {
                              return
                            }
                            
                            if (/[0-9]/.test(e.key)) {
                              return
                            }
                            
                            if (e.ctrlKey && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) {
                              return
                            }
                            
                            e.preventDefault()
                          }}
                          onBlur={() => {
                            if (customerPayment > 0) {
                              setAppliedCashPayment(appliedCashPayment + customerPayment)
                              setCustomerPayment(0)
                              setCustomerPaymentInput('')
                            }
                          }}
                          placeholder="0.00"
                          className="w-20 px-2 py-1 border-2 border-gray-300 rounded text-right text-black font-bold focus:border-blue-500 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      Enter, click elsewhere, or 'Apply Cash' to apply
                    </div>
                    <div className="h-5 mt-1">
                      {customerPayment > 0 ? (
                        <div className="flex justify-between items-center">
                          <span className="text-black font-medium text-xs">Change</span>
                          <span className={`font-bold text-xs ${customerPayment >= remainingBalance ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(Math.max(0, toCents(customerPayment - remainingBalance)))}
                          </span>
                        </div>
                      ) : (
                        <div className="h-full"></div>
                      )}
                    </div>
                  </div>
                ) : selectedPaymentMethod === 'card' ? (
                  <div className="p-2 bg-blue-50 border border-blue-200 rounded h-full">
                    <div className="text-center text-black">
                      <div className="font-medium text-sm mb-1">Card Payment Selected</div>
                      <div className="text-xs text-gray-600">
                        Process payment on external terminal, then click "Complete Transaction"
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full"></div>
                )}
              </div>
            </div>

            {selectedPaymentMethod === 'cash' && remainingBalance > 0 && (
              <div className="flex-1 flex gap-3 min-h-0 overflow-hidden">
                <div className="flex-1 min-h-0">
                  <div className="grid grid-cols-3 gap-1 h-full max-h-40">
                    {generateCashAmounts().map((amount) => (
                      <button
                        key={amount}
                        className={`rounded text-black font-medium text-xs h-12 ${
                          customerPayment === amount 
                            ? 'bg-blue-300 border-2 border-blue-500' 
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                        onClick={() => {
                          if (customerPayment === amount) {
                            setAppliedCashPayment(appliedCashPayment + customerPayment)
                            setCustomerPayment(0)
                            setCustomerPaymentInput('')
                          } else {
                            setCustomerPayment(amount)
                            setCustomerPaymentInput(amount.toString())
                          }
                        }}
                      >
                        {formatCurrency(toCents(amount))}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1 w-14">
                  <button 
                    className="py-1 bg-gray-200 hover:bg-gray-300 rounded text-black font-medium text-xs h-12"
                    onClick={() => {
                      if (customerPayment > 0) {
                        setAppliedCashPayment(appliedCashPayment + customerPayment)
                        setCustomerPayment(0)
                        setCustomerPaymentInput('')
                      }
                    }}
                  >
                    Apply Cash
                  </button>
                </div>
              </div>
            )}

            <div className="flex-shrink-0 mt-auto pt-2 h-16">
              <div className="flex gap-3 border-t border-gray-200 pt-2 h-full">
                <button
                  className="flex-1 py-3 px-4 font-medium rounded text-sm transition-colors"
                  style={{
                    backgroundColor: '#2563eb',
                    color: 'white',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1d4ed8'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#2563eb'
                  }}
                  onClick={() => {
                    // Confirm and return to cart - keep cart intact, just close modal and reset payment state
                    setCustomerPayment(0)
                    setCustomerPaymentInput('')
                    setAppliedCashPayment(0)
                    setSelectedPaymentMethod(null)
                    setCheckoutModalOpen(false)
                  }}
                >
                  confirm
                </button>
                <button
                  className="flex-1 py-3 px-4 font-medium rounded text-sm transition-colors"
                  style={{
                    backgroundColor: '#dc2626',
                    color: 'white',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#b91c1c'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#dc2626'
                  }}
                  onClick={() => {
                    // Cancel entire transaction - clear cart and close modal
                    cancelSale()
                  }}
                >
                  cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Discount Modal */}
      {isDiscountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => {
              setDiscountModalOpen(false)
              setDiscountModalStep('initial')
              setDiscountAmount('')
              setDiscountType('flat')
              setDiscountReason('')
              setSelectedItemForDiscount(null)
            }}
          ></div>
          
          <div className="relative bg-gray-800 rounded-lg p-6 mx-4 w-full max-w-2xl border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-gray-100">Apply Discount</h2>

            {/* Initial Step - Choose discount type */}
            {discountModalStep === 'initial' && (
              <div className="space-y-4">
                <button
                  className="w-full p-6 bg-gray-700 hover:bg-gray-600 rounded-lg border border-gray-600 transition-colors"
                  onClick={() => setDiscountModalStep('entireCart')}
                >
                  <div className="text-left">
                    <div className="text-xl font-semibold text-gray-100 mb-2">Apply to Entire Cart</div>
                    <div className="text-gray-400">Apply a discount to the total cart amount</div>
                  </div>
                </button>
                
                <button
                  className="w-full p-6 bg-gray-700 hover:bg-gray-600 rounded-lg border border-gray-600 transition-colors"
                  onClick={() => setDiscountModalStep('specificItem')}
                >
                  <div className="text-left">
                    <div className="text-xl font-semibold text-gray-100 mb-2">Apply to Specific Item</div>
                    <div className="text-gray-400">Apply a discount to a single item in the cart</div>
                  </div>
                </button>
                
                <div className="flex justify-end mt-6">
                  <button
                    className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-gray-100 rounded-lg transition-colors"
                    onClick={() => setDiscountModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Entire Cart Discount Step */}
            {discountModalStep === 'entireCart' && (
              <div className="space-y-4">
                <button
                  className="text-blue-400 hover:text-blue-300 mb-4"
                  onClick={() => setDiscountModalStep('initial')}
                >
                  ← Back to options
                </button>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Discount Amount
                  </label>
                  <input
                    type="text"
                    value={discountAmount}
                    onChange={(e) => {
                      const value = e.target.value
                      if (/^\d*\.?\d{0,2}$/.test(value) || value === '') {
                        setDiscountAmount(value)
                      }
                    }}
                    placeholder="0.00"
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Discount Type
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="discountType"
                        value="flat"
                        checked={discountType === 'flat'}
                        onChange={(e) => setDiscountType(e.target.value as 'flat' | 'percentage')}
                        className="mr-2 text-amber-500"
                      />
                      <div className="text-left">
                        <span className="text-gray-300">$ (Flat Amount)</span>
                        <div className="text-xs text-gray-500">Deducted from line total</div>
                      </div>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="discountType"
                        value="percentage"
                        checked={discountType === 'percentage'}
                        onChange={(e) => setDiscountType(e.target.value as 'flat' | 'percentage')}
                        className="mr-2 text-amber-500"
                      />
                      <div className="text-left">
                        <span className="text-gray-300">% (Percentage)</span>
                        <div className="text-xs text-gray-500">Percent off cart total</div>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Reason/Note (Optional)
                  </label>
                  <input
                    type="text"
                    value={discountReason}
                    onChange={(e) => setDiscountReason(e.target.value)}
                    placeholder="e.g., Employee discount, Promotion, etc."
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-amber-500"
                  />
                                    </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-gray-100 rounded-lg transition-colors"
                    onClick={() => setDiscountModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                    disabled={!discountAmount || parseFloat(discountAmount) <= 0}
                    onClick={() => {
                      const amount = parseFloat(discountAmount)
                      setCartDiscount({
                        amount,
                        type: discountType,
                        reason: discountReason || undefined
                      })
                      setDiscountModalOpen(false)
                      setDiscountModalStep('initial')
                      setDiscountAmount('')
                      setDiscountType('flat')
                      setDiscountReason('')
                    }}
                  >
                    Apply Discount
                  </button>
                </div>
              </div>
            )}

            {/* Specific Item Discount Step */}
            {discountModalStep === 'specificItem' && (
              <div className="space-y-4">
                <button
                  className="text-blue-400 hover:text-blue-300 mb-4"
                  onClick={() => setDiscountModalStep('initial')}
                >
                  ← Back to options
                </button>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Select Item
                  </label>
                  <div className="max-h-60 overflow-y-auto space-y-2 border border-gray-600 rounded-lg p-2">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedItemForDiscount === item.id
                            ? 'bg-amber-600 text-white'
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-100'
                        }`}
                        onClick={() => setSelectedItemForDiscount(item.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm opacity-75">SKU: {item.sku} | Qty: {item.quantity}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{formatCurrency(toCents(item.price))}</div>
                            <div className="text-sm">Total: {formatCurrency(toCents(item.price * item.quantity))}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedItemForDiscount && (
                  <>
                    {/* Show discount preview */}
                    {discountAmount && parseFloat(discountAmount) > 0 && (
                      <div className="p-3 bg-gray-700 border border-amber-500 rounded-lg">
                        <div className="text-gray-300 text-sm font-medium mb-2">Discount Preview:</div>
                        {(() => {
                          const selectedItem = cartItems.find(item => item.id === selectedItemForDiscount)
                          if (!selectedItem) return null
                          const originalLineTotal = selectedItem.price * selectedItem.quantity
                          const discountValue = parseFloat(discountAmount)
                          
                          if (discountType === 'flat') {
                            const newLineTotal = Math.max(0, originalLineTotal - discountValue)
                            const actualDiscount = Math.min(discountValue, originalLineTotal)
                            return (
                              <div className="text-gray-100 text-sm">
                                <div>Unit Price: {formatCurrency(toCents(selectedItem.price))} (unchanged)</div>
                                <div>Line Total: {formatCurrency(toCents(originalLineTotal))} - {formatCurrency(toCents(actualDiscount))} = <span className="text-amber-400">{formatCurrency(toCents(newLineTotal))}</span></div>
                                <div className="text-green-400">Total Savings: {formatCurrency(toCents(actualDiscount))}</div>
                              </div>
                            )
                          } else {
                            const newLineTotal = originalLineTotal * (1 - discountValue / 100)
                            const totalSavings = originalLineTotal - newLineTotal
                            return (
                              <div className="text-gray-100 text-sm">
                                <div>Unit Price: {formatCurrency(toCents(selectedItem.price))} (unchanged)</div>
                                <div>Line Total: {formatCurrency(toCents(originalLineTotal))} - {formatCurrency(toCents(totalSavings))} = <span className="text-amber-400">{formatCurrency(toCents(newLineTotal))}</span></div>
                                <div className="text-green-400">Total Savings: {formatCurrency(toCents(totalSavings))}</div>
                              </div>
                            )
                          }
                        })()}
                      </div>
                    )}

                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Discount Amount
                      </label>
                      <input
                        type="text"
                        value={discountAmount}
                        onChange={(e) => {
                          const value = e.target.value
                          if (/^\d*\.?\d{0,2}$/.test(value) || value === '') {
                            setDiscountAmount(value)
                          }
                        }}
                        placeholder="0.00"
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Discount Type
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="discountType"
                            value="flat"
                            checked={discountType === 'flat'}
                            onChange={(e) => setDiscountType(e.target.value as 'flat' | 'percentage')}
                            className="mr-2 text-amber-500"
                          />
                          <div className="text-left">
                            <span className="text-gray-300">$ (Flat Amount)</span>
                            <div className="text-xs text-gray-500">Deducted from line total</div>
                          </div>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="discountType"
                            value="percentage"
                            checked={discountType === 'percentage'}
                            onChange={(e) => setDiscountType(e.target.value as 'flat' | 'percentage')}
                            className="mr-2 text-amber-500"
                          />
                          <div className="text-left">
                            <span className="text-gray-300">% (Percentage)</span>
                            <div className="text-xs text-gray-500">Percent off line total</div>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Reason/Note (Optional)
                      </label>
                      <input
                        type="text"
                        value={discountReason}
                        onChange={(e) => setDiscountReason(e.target.value)}
                        placeholder="e.g., Employee discount, Promotion, etc."
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    {/* Validation message for flat discounts on specific items */}
                    {selectedItemForDiscount && discountType === 'flat' && discountAmount && parseFloat(discountAmount) > 0 && (
                      (() => {
                        const selectedItem = cartItems.find(item => item.id === selectedItemForDiscount)
                        if (selectedItem) {
                          const lineTotal = selectedItem.price * selectedItem.quantity
                          if (parseFloat(discountAmount) > lineTotal) {
                            return (
                              <div className="p-2 bg-red-900 border border-red-600 rounded text-red-300 text-sm">
                                <strong>Warning:</strong> Discount amount ({formatCurrency(toCents(parseFloat(discountAmount)))}) cannot exceed line total ({formatCurrency(toCents(lineTotal))})
                              </div>
                            )
                          }
                        }
                        return null
                      })()
                    )}
                  </>
                )}

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-gray-100 rounded-lg transition-colors"
                    onClick={() => setDiscountModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                    disabled={(() => {
                      if (!selectedItemForDiscount || !discountAmount || parseFloat(discountAmount) <= 0) return true
                      
                      // For flat discounts on specific items, prevent discount larger than line total
                      if (discountType === 'flat') {
                        const selectedItem = cartItems.find(item => item.id === selectedItemForDiscount)
                        if (selectedItem) {
                          const lineTotal = selectedItem.price * selectedItem.quantity
                          return parseFloat(discountAmount) > lineTotal
                        }
                      }
                      
                      return false
                    })()}
                    onClick={() => {
                      const amount = parseFloat(discountAmount)
                      setItemDiscount(selectedItemForDiscount!, {
                        amount,
                        type: discountType,
                        reason: discountReason || undefined
                      })
                      setDiscountModalOpen(false)
                      setDiscountModalStep('initial')
                      setDiscountAmount('')
                      setDiscountType('flat')
                      setDiscountReason('')
                      setSelectedItemForDiscount(null)
                    }}
                  >
                    Apply Discount
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}


      {/* Payment Confirmed Modal */}
      {showPaymentConfirmedModal && confirmedSaleData && (
        <PaymentConfirmedModal
          saleData={confirmedSaleData}
          onClose={() => {
            setShowPaymentConfirmedModal(false);
            setConfirmedSaleData(null);
            // Clear cart and reset all state for a new sale
            clearCart();
            setCustomerPayment(0);
            setCustomerPaymentInput('');
            setAppliedCashPayment(0);
            setDiscountModalOpen(false);
            setDiscountModalStep('initial');
            setDiscountAmount('');
            setDiscountType('flat');
            setDiscountReason('');
            setSelectedItemForDiscount(null);
          }}
          onPrint={handlePrintReceipt}
        />

      )}
    </div>
  )
}
