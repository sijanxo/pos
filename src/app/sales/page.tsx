'use client'

import { useEffect, useState } from 'react'
import { Search, Plus, Minus, Trash2Icon } from 'lucide-react'

interface Product {
  id: number
  sku: string
  name: string
  price: number
}

interface CartItem extends Product {
  quantity: number
}

export default function Sales() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)
  const [customerPayment, setCustomerPayment] = useState(0)
  const [customerPaymentInput, setCustomerPaymentInput] = useState('')
  const [appliedCashPayment, setAppliedCashPayment] = useState(0)
  const [searchResults, setSearchResults] = useState<Product[]>([
    {
      id: 1,
      sku: 'WN-001',
      name: 'Cabernet Sauvignon',
      price: 24.99,
    },
    {
      id: 2,
      sku: 'WN-002',
      name: 'Chardonnay',
      price: 19.99,
    },
    {
      id: 3,
      sku: 'WN-003',
      name: 'Merlot',
      price: 22.99,
    },
    {
      id: 4,
      sku: 'BR-001',
      name: 'Craft IPA',
      price: 12.99,
    },
  ])
  const [activeItem, setActiveItem] = useState(0)
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 5,
      sku: 'SP-001',
      name: 'Gin',
      price: 34.99,
      quantity: 1,
    },
    {
      id: 6,
      sku: 'SP-002',
      name: 'Vodka',
      price: 29.99,
      quantity: 2,
    },
  ])

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
  }, [searchQuery, activeItem, searchResults])

  const addToCart = (item: Product) => {
    const existingItem = cartItems.find((cartItem: CartItem) => cartItem.id === item.id)
    if (existingItem) {
      setCartItems(
        cartItems.map((cartItem: CartItem) =>
          cartItem.id === item.id
            ? {
                ...cartItem,
                quantity: cartItem.quantity + 1,
              }
            : cartItem,
        ),
      )
    } else {
      setCartItems([
        ...cartItems,
        {
          ...item,
          quantity: 1,
        },
      ])
    }
    setSearchQuery('')
  }

  const removeFromCart = (id: number) => {
    setCartItems(cartItems.filter((item: CartItem) => item.id !== id))
  }

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return
    setCartItems(
      cartItems.map((item: CartItem) =>
        item.id === id
          ? {
              ...item,
              quantity: newQuantity,
            }
          : item,
      ),
    )
  }

  const totalAmount = cartItems.reduce(
    (sum: number, item: CartItem) => sum + item.price * item.quantity,
    0,
  )
  const totalQuantity = cartItems.reduce((sum: number, item: CartItem) => sum + item.quantity, 0)
  const remainingBalance = totalAmount - appliedCashPayment

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

        {searchQuery && (
          <div className="mb-4">
            <h2 className="text-lg font-medium mb-2 text-gray-300">Search Results</h2>
            <div className="space-y-2">
              {searchResults.map((result, index) => (
                <div
                  key={result.id}
                  className={`p-3 rounded-lg flex justify-between items-center cursor-pointer ${index === activeItem ? 'bg-amber-600' : 'bg-gray-800'}`}
                  onClick={() => {
                    setActiveItem(index)
                    addToCart(result)
                  }}
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 text-center">1</span>
                    <span className="w-20">{result.sku}</span>
                    <span className="flex-1">{result.name}</span>
                  </div>
                  <span className="font-medium">${result.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

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
                <div
                  key={item.id}
                  className="p-3 bg-gray-800 rounded-lg flex justify-between items-center"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-1 rounded-md bg-gray-700 hover:bg-gray-600"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus size={16} className="text-gray-300" />
                      </button>
                      <input
                        type="text"
                        defaultValue={item.quantity}
                        style={{
                          width: '70px',
                          height: '30px',
                          textAlign: 'center',
                          backgroundColor: 'white',
                          color: 'black',
                          border: '2px solid black',
                          fontSize: '18px',
                          padding: '2px'
                        }}
                        onChange={(e) => {
                          const value = parseInt(e.target.value, 10)
                          if (!isNaN(value) && value >= 1) {
                            updateQuantity(item.id, value)
                          }
                        }}
                      />
                      <button
                        className="p-1 rounded-md bg-gray-700 hover:bg-gray-600"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus size={16} className="text-gray-300" />
                      </button>
                    </div>
                    <span className="w-20">{item.sku}</span>
                    <span className="flex-1">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="w-24 text-right">${item.price.toFixed(2)}</span>
                    <span className="w-24 text-right font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    <button
                      className="p-1 rounded-md text-gray-400 hover:text-red-500"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2Icon size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">No items in cart</div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4 border-t border-gray-700 z-10">
        <div className="flex justify-between items-center mb-3">
          <div className="text-gray-300">
            <span className="font-medium mr-2">Total Items:</span>
            <span className="text-xl">{totalQuantity}</span>
          </div>
          <div className="flex items-center">
            <span className="text-xl mr-2">Total</span>
            <span className="text-2xl font-bold">${totalAmount.toFixed(2)}</span>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            className="w-1/2 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xl transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
            disabled={cartItems.length === 0}
            onClick={() => {
              // TODO: Implement discount functionality
              console.log('Apply discount clicked')
            }}
          >
            Apply Discount
          </button>
          <button 
            className="w-1/2 py-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xl transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
            disabled={cartItems.length === 0}
            onClick={() => {
              setCustomerPayment(0)
              setCustomerPaymentInput('')
              setAppliedCashPayment(0)
              setIsCheckoutModalOpen(true)
            }}
          >
            Pay
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
              setIsCheckoutModalOpen(false)
            }}
          ></div>
          
          <div className="relative bg-white rounded-lg p-4 mx-4 w-full max-w-2xl h-[520px] border-2 border-blue-500 flex flex-col">
            <h2 className="text-xl font-bold mb-4 text-black">payment</h2>

            <div className="flex-shrink-0 mb-3">
              <div className="mb-3 p-2 bg-gray-50 rounded">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-black font-medium text-sm">Original Total</span>
                  <span className="text-black font-bold">${totalAmount.toFixed(2)}</span>
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
                        <span className="text-green-700 font-bold">-${appliedCashPayment.toFixed(2)}</span>
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

              <div className={`mb-3 p-2 rounded ${remainingBalance <= 0 ? 'bg-green-50 border border-green-300' : 'bg-blue-50 border border-blue-300'}`}>
                <div className="flex justify-between items-center">
                  <span className={`font-medium ${remainingBalance <= 0 ? 'text-green-700' : 'text-black'}`}>
                    {remainingBalance <= 0 ? 'Order Paid In Full' : 'Remaining Balance'}
                  </span>
                  <span className={`font-bold text-lg ${remainingBalance <= 0 ? 'text-green-700' : 'text-blue-700'}`}>
                    ${remainingBalance <= 0 ? '0.00' : remainingBalance.toFixed(2)}
                  </span>
                </div>
                <div className="h-12 mt-2">
                  {remainingBalance <= 0 ? (
                    <button
                      className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded"
                      onClick={() => {
                        setCartItems([])
                        setCustomerPayment(0)
                        setCustomerPaymentInput('')
                        setAppliedCashPayment(0)
                        setIsCheckoutModalOpen(false)
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
                {remainingBalance > 0 ? (
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
                      Enter, click elsewhere, or 'cash' to apply
                    </div>
                    <div className="h-5 mt-1">
                      {customerPayment > 0 ? (
                        <div className="flex justify-between items-center">
                          <span className="text-black font-medium text-xs">Change</span>
                          <span className={`font-bold text-xs ${customerPayment >= remainingBalance ? 'text-green-600' : 'text-red-600'}`}>
                            ${Math.max(0, customerPayment - remainingBalance).toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <div className="h-full"></div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="h-full"></div>
                )}
              </div>
            </div>

            {remainingBalance > 0 && (
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
                        ${amount.toFixed(2)}
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
                    cash
                  </button>
                  <button className="py-1 bg-gray-200 hover:bg-gray-300 rounded text-black font-medium text-xs h-12">
                    credit
                  </button>
                  <button className="py-1 bg-gray-200 hover:bg-gray-300 rounded text-black font-medium text-xs h-12">
                    debit
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
                    setIsCheckoutModalOpen(false)
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
                    setCartItems([])
                    setCustomerPayment(0)
                    setCustomerPaymentInput('')
                    setAppliedCashPayment(0)
                    setIsCheckoutModalOpen(false)
                  }}
                >
                  cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
