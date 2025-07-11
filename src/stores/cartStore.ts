import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import { Product } from '@/types';


export interface CartItem extends Product {
  quantity: number;
  discount?: {
    amount: number;
    type: 'flat' | 'percentage';
    reason?: string;
  };
}

export interface CartDiscount {
  amount: number;
  type: 'flat' | 'percentage';
  reason?: string;
}

interface CartStore {
  // State
  searchQuery: string;
  cartItems: CartItem[];
  cartDiscount: CartDiscount | null;
  
  // Discount modal states
  isDiscountModalOpen: boolean;
  discountModalStep: 'initial' | 'entireCart' | 'specificItem';

  selectedItemForDiscount: string | null;

  discountAmount: string;
  discountType: 'flat' | 'percentage';
  discountReason: string;
  
  // Checkout modal states
  isCheckoutModalOpen: boolean;
  customerPayment: number;
  customerPaymentInput: string;
  appliedCashPayment: number;
  
  // Actions
  setSearchQuery: (query: string) => void;
  addToCart: (item: Product) => void;

  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, newQuantity: number) => void;

  clearCart: () => void;
  
  // Discount actions
  setCartDiscount: (discount: CartDiscount | null) => void;

  setItemDiscount: (itemId: string, discount: CartItem['discount']) => void;
  setDiscountModalOpen: (open: boolean) => void;
  setDiscountModalStep: (step: 'initial' | 'entireCart' | 'specificItem') => void;
  setSelectedItemForDiscount: (itemId: string | null) => void;

  setDiscountAmount: (amount: string) => void;
  setDiscountType: (type: 'flat' | 'percentage') => void;
  setDiscountReason: (reason: string) => void;
  
  // Checkout actions
  setCheckoutModalOpen: (open: boolean) => void;
  setCustomerPayment: (payment: number) => void;
  setCustomerPaymentInput: (input: string) => void;
  setAppliedCashPayment: (payment: number) => void;
  
  // Complete sale and clear all data
  completeSale: () => void;
  cancelSale: () => void;
}

export const useCartStore = create<CartStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        searchQuery: '',
        cartItems: [
          {

            id: '5',
            sku: 'SP-001',
            name: 'Gin',
            category: 'Spirits',
            brand: 'Premium Brand',
            volumeMl: 750,
            price: 34.99,
            cost: 25.00,
            stockQuantity: 50,
            minStockLevel: 10,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            quantity: 1,
          },
          {
            id: '6',
            sku: 'SP-002',
            name: 'Vodka',
            category: 'Spirits',
            brand: 'Premium Brand',
            volumeMl: 750,
            price: 29.99,
            cost: 20.00,
            stockQuantity: 30,
            minStockLevel: 10,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            quantity: 2,
          },
        ],
        cartDiscount: null,
        
        // Discount modal states
        isDiscountModalOpen: false,
        discountModalStep: 'initial',
        selectedItemForDiscount: null,
        discountAmount: '',
        discountType: 'flat',
        discountReason: '',
        
        // Checkout modal states
        isCheckoutModalOpen: false,
        customerPayment: 0,
        customerPaymentInput: '',
        appliedCashPayment: 0,
        
        // Actions
        setSearchQuery: (query: string) => {
          set({ searchQuery: query });
        },
        
        addToCart: (item: Product) => {
          const { cartItems } = get();
          const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);
          
          if (existingItem) {
            set({
              cartItems: cartItems.map((cartItem) =>
                cartItem.id === item.id
                  ? { ...cartItem, quantity: cartItem.quantity + 1 }
                  : cartItem
              ),
              searchQuery: '', // Clear search query when adding to cart
            });
          } else {
            set({
              cartItems: [...cartItems, { ...item, quantity: 1 }],
              searchQuery: '', // Clear search query when adding to cart
            });
          }
        },
        

        removeFromCart: (id: string) => {
          const { cartItems } = get();
          set({
            cartItems: cartItems.filter((item) => item.id !== id),
          });
        },
        

        updateQuantity: (id: string, newQuantity: number) => {

          if (newQuantity < 1) return;
          
          const { cartItems } = get();
          set({
            cartItems: cartItems.map((item) =>
              item.id === id
                ? { ...item, quantity: newQuantity }
                : item
            ),
          });
        },
        
        clearCart: () => {
          set({
            cartItems: [],
            cartDiscount: null,
            searchQuery: '',
          });
        },
        
        // Discount actions
        setCartDiscount: (discount: CartDiscount | null) => {
          set({ cartDiscount: discount });
        },
        

        setItemDiscount: (itemId: string, discount: CartItem['discount']) => {

          const { cartItems } = get();
          set({
            cartItems: cartItems.map((item) =>
              item.id === itemId
                ? { ...item, discount }
                : item
            ),
          });
        },
        
        setDiscountModalOpen: (open: boolean) => {
          set({ isDiscountModalOpen: open });
        },
        
        setDiscountModalStep: (step: 'initial' | 'entireCart' | 'specificItem') => {
          set({ discountModalStep: step });
        },
        

        setSelectedItemForDiscount: (itemId: string | null) => {

          set({ selectedItemForDiscount: itemId });
        },
        
        setDiscountAmount: (amount: string) => {
          set({ discountAmount: amount });
        },
        
        setDiscountType: (type: 'flat' | 'percentage') => {
          set({ discountType: type });
        },
        
        setDiscountReason: (reason: string) => {
          set({ discountReason: reason });
        },
        
        // Checkout actions
        setCheckoutModalOpen: (open: boolean) => {
          set({ isCheckoutModalOpen: open });
        },
        
        setCustomerPayment: (payment: number) => {
          set({ customerPayment: payment });
        },
        
        setCustomerPaymentInput: (input: string) => {
          set({ customerPaymentInput: input });
        },
        
        setAppliedCashPayment: (payment: number) => {
          set({ appliedCashPayment: payment });
        },
        
        // Complete sale and clear all data
        completeSale: () => {
          set({
            cartItems: [],
            cartDiscount: null,
            searchQuery: '',
            isDiscountModalOpen: false,
            discountModalStep: 'initial',
            selectedItemForDiscount: null,
            discountAmount: '',
            discountType: 'flat',
            discountReason: '',
            isCheckoutModalOpen: false,
            customerPayment: 0,
            customerPaymentInput: '',
            appliedCashPayment: 0,
          });
        },
        
        cancelSale: () => {
          set({
            cartItems: [],
            cartDiscount: null,
            searchQuery: '',
            isDiscountModalOpen: false,
            discountModalStep: 'initial',
            selectedItemForDiscount: null,
            discountAmount: '',
            discountType: 'flat',
            discountReason: '',
            isCheckoutModalOpen: false,
            customerPayment: 0,
            customerPaymentInput: '',
            appliedCashPayment: 0,
          });
        },
      }),
      {
        name: 'cart-store',
        // Only persist the essential cart data, not UI state
        partialize: (state) => ({
          cartItems: state.cartItems,
          cartDiscount: state.cartDiscount,
          searchQuery: state.searchQuery,
        }),
      }
    ),
    {
      name: 'cart-store',
    }
  )
);

// Helper hooks for common cart operations
export const useCartItems = () => {
  return useCartStore(state => state.cartItems);
};

export const useCartDiscount = () => {
  return useCartStore(state => state.cartDiscount);
};

export const useSearchQuery = () => {
  return useCartStore(state => state.searchQuery);
};

export const useCartActions = () => {
  return useCartStore(state => ({
    addToCart: state.addToCart,
    removeFromCart: state.removeFromCart,
    updateQuantity: state.updateQuantity,
    clearCart: state.clearCart,
    setSearchQuery: state.setSearchQuery,
    completeSale: state.completeSale,
    cancelSale: state.cancelSale,
  }));
};