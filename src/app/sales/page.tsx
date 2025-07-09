'use client'

import { useEffect, useState } from 'react'
import { UserIcon, Search, Plus, Minus, Trash2Icon } from 'lucide-react'

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

  // Handle keyboard navigation for search results
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!searchQuery) return // Only handle keyboard events when search is active
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault()
          setActiveItem((prev: number) =>
            prev > 0 ? prev - 1 : searchResults.length - 1,
          )
          break
        case 'ArrowDown':
          e.preventDefault()
          setActiveItem((prev: number) =>
            prev < searchResults.length - 1 ? prev + 1 : 0,
          )
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
    // Clear search query after adding to cart
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

  return (
    <div className="flex flex-col w-full h-screen bg-gray-900 text-gray-100 relative">
      {/* Top Section - Search, Results, Cart */}
      <div className="flex-1 overflow-hidden flex flex-col p-4 pb-[160px]">
        {/* Search Bar */}
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

        {/* Search Results */}
        {searchQuery && (
          <div className="mb-4">
            <h2 className="text-lg font-medium mb-2 text-gray-300">
              Search Results
            </h2>
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
                  <span className="font-medium">
                    ${result.price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-auto">
          <h2 className="text-lg font-medium mb-2 text-gray-300">Cart Items</h2>
          {cartItems.length > 0 ? (
            <div className="space-y-2">
              {/* Column Headers */}
              <div className="p-3 bg-gray-700 rounded-lg flex justify-between items-center font-medium text-gray-300 text-sm">
                <div className="flex items-center gap-4">
                  <span className="w-[104px] text-center">Quantity</span>
                  <span className="w-20">SKU</span>
                  <span className="flex-1">Name</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-24 text-right">Unit Price</span>
                  <span className="w-24 text-right mr-6">Total Price</span>
                  <span className="w-6"></span> {/* Space for delete button */}
                </div>
              </div>
              {/* Cart Items */}
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-gray-800 rounded-lg flex justify-between items-center"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-1 rounded-md bg-gray-700 hover:bg-gray-600"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
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
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Plus size={16} className="text-gray-300" />
                      </button>
                    </div>
                    <span className="w-20">{item.sku}</span>
                    <span className="flex-1">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="w-24 text-right">
                      ${item.price.toFixed(2)}
                    </span>
                    <span className="w-24 text-right font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
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
            <div className="text-center text-gray-500 py-8">
              No items in cart
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section - Totals & Pay Button - Fixed to bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4 border-t border-gray-700 z-10">
        <div className="flex justify-between items-center mb-3">
          <div className="text-gray-300">
            <span className="font-medium mr-2">Total Items:</span>
            <span className="text-xl">{totalQuantity}</span>
          </div>
          <div className="flex items-center">
            <span className="text-xl mr-2">Total</span>
            <span className="text-2xl font-bold">
              ${totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
        <button 
          className="w-full py-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xl transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
          disabled={cartItems.length === 0}
          onClick={() => setIsCheckoutModalOpen(true)}
        >
          Pay
        </button>
      </div>

      {/* Checkout Modal */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop overlay */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsCheckoutModalOpen(false)}
          ></div>
          
          {/* Modal content */}
          <div className="relative bg-gray-800 rounded-lg p-6 mx-4 w-full max-w-md border border-gray-700">
            {/* Close button */}
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              onClick={() => setIsCheckoutModalOpen(false)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal header */}
            <h2 className="text-2xl font-bold mb-6 text-white">Checkout</h2>

            {/* Order summary */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4 text-gray-300">Order Summary</h3>
              <div className="space-y-2 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <span className="text-gray-300">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="text-white font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Total */}
              <div className="border-t border-gray-600 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-300">Total:</span>
                  <span className="text-2xl font-bold text-white">
                    ${totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                className="flex-1 py-3 bg-gray-600 hover:bg-gray-500 text-white font-medium rounded-lg transition-colors"
                onClick={() => setIsCheckoutModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors"
                onClick={() => {
                  // Here you would typically process the payment
                  // For now, we'll just close the modal and clear the cart
                  setCartItems([])
                  setIsCheckoutModalOpen(false)
                }}
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
