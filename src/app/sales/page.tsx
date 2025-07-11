'use client'

import { useEffect, useState } from 'react'

import { Search, Plus, Minus, Trash2Icon, Check, Receipt } from 'lucide-react' // Merged icons
import { toCents, fromCents, formatCurrency, calculateDiscountAmount, calculateTax, generateId } from '@/utils' // Merged utils, including calculateTax
import { useCartStore, Product, CartItem } from '@/stores/cartStore'
import { useSalesStore, SaleData } from '@/stores/salesStore' // Using useSalesStore
import { PaymentConfirmedModal } from '@/components/PaymentConfirmedModal' // New modal component
import { ReceiptDisplay } from '@/components/ReceiptDisplay' // Keep for direct rendering if needed elsewhere, but print logic will generate HTML

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
    cancelSale,
  } = useCartStore();

  // Sales store hook
  const { addSale } = useSalesStore(); // Use this consistently

  // State for PaymentConfirmedModal
  const [showPaymentConfirmedModal, setShowPaymentConfirmedModal] = useState<boolean>(false);
  const [confirmedSaleData, setConfirmedSaleData] = useState<SaleData | null>(null);

  // Add payment method selection state (from previous fix)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'cash' | 'card' | null>(null);

  const [searchResults, setSearchResults] = useState<Product[]>([
    {
      id: '1',
      sku: 'WN-001',
      name: 'Cabernet Sauvignon',
      category: 'Wine',
      brand: 'Premium Brand',
      volumeMl: 750,
      price: 24.99,
      cost: 18.00,
      stockQuantity: 25,
      minStockLevel: 5,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      sku: 'WN-002',
      name: 'Chardonnay',
      category: 'Wine',
      brand: 'Premium Brand',
      volumeMl: 750,
      price: 19.99,
      cost: 15.00,
      stockQuantity: 30,
      minStockLevel: 5,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      sku: 'WN-003',
      name: 'Merlot',
      category: 'Wine',
      brand: 'Premium Brand',
      volumeMl: 750,
      price: 22.99,
      cost: 17.00,
      stockQuantity: 20,
      minStockLevel: 5,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '4',
      sku: 'BR-001',
      name: 'Craft IPA',
      category: 'Beer',
      brand: 'Local Brewery',
      volumeMl: 500,
      price: 12.99,
      cost: 8.00,
      stockQuantity: 40,
      minStockLevel: 10,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ])
  const [activeItem, setActiveItem] = useState(0)
  const [editingQuantity, setEditingQuantity] = useState<Record<string, string>>({})

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

  // Transaction completion logic - explicit handling for each payment method (from previous fix)
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

  // Handle print receipt - open new window with receipt (from merged branch)
  const handlePrintReceipt = (saleData: SaleData) => {
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) {
      alert('Please allow popups to print the receipt');
      return;
    }

    // Create the HTML content for the receipt
    const receiptHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt - ${saleData.id}</title>
          <style>
            body {
              font-family: 'Courier New', monospace;
              font-size: 12px;
              line-height: 1.4;
              margin: 20px;
              color: #000;
              background: #fff;
            }
            .receipt-container {
              max-width: 300px;
              margin: 0 auto;
            }
            .receipt-header {
              text-align: center;
              margin-bottom: 20px;
              border-bottom: 1px solid #000;
              padding-bottom: 10px;
            }
            .receipt-header h1 {
              margin: 0 0 10px 0;
              font-size: 16px;
              font-weight: bold;
            }
            .receipt-header p {
              margin: