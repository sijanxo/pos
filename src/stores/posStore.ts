import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Product, Cart, CartItem, Transaction, POSState } from '@/types';
import { 
  calculateSubtotal, 
  calculateTax, 
  calculateTotal, 
  calculateChange,
  generateId,
  fuzzySearch
} from '@/utils';
import { mockProducts, mockSystemSettings } from '@/lib/mockData';

interface POSStore extends POSState {
  // Product actions
  searchProducts: (query: string) => void;
  setSelectedProduct: (product: Product | null) => void;
  clearSearch: () => void;
  
  // Cart actions
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateCartItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  applyDiscount: (amount: number) => void;
  
  // Transaction actions
  processTransaction: (paymentMethod: 'cash' | 'card', cashReceived?: number) => Transaction;
  
  // Utility actions
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

const initialCart: Cart = {
  items: [],
  subtotal: 0,
  tax: 0,
  discount: 0,
  total: 0,
};

export const usePOSStore = create<POSStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      cart: initialCart,
      selectedProduct: null,
      searchQuery: '',
      searchResults: [],
      isLoading: false,
      error: null,

      // Product actions
      searchProducts: (query: string) => {
        set({ searchQuery: query, isLoading: true });
        
        // Simulate API delay for realistic feel
        setTimeout(() => {
          if (query.trim() === '') {
            set({ searchResults: mockProducts.slice(0, 20), isLoading: false });
            return;
          }

          const results = mockProducts.filter(product => {
            const searchText = `${product.name} ${product.brand} ${product.category} ${product.sku}`.toLowerCase();
            return fuzzySearch(query, searchText) && product.isActive;
          });

          set({ searchResults: results, isLoading: false });
        }, 100);
      },

      setSelectedProduct: (product: Product | null) => {
        set({ selectedProduct: product });
      },

      clearSearch: () => {
        set({ searchQuery: '', searchResults: [], selectedProduct: null });
      },

      // Cart actions
      addToCart: (product: Product, quantity: number = 1) => {
        const { cart } = get();
        
        // Check if product already exists in cart
        const existingItemIndex = cart.items.findIndex(
          item => item.product.id === product.id
        );

        let newItems: CartItem[];
        
        if (existingItemIndex >= 0) {
          // Update existing item quantity
          newItems = cart.items.map((item, index) => 
            index === existingItemIndex 
              ? { 
                  ...item, 
                  quantity: item.quantity + quantity,
                  totalPrice: (item.quantity + quantity) * item.unitPrice
                }
              : item
          );
        } else {
          // Add new item to cart
          const newItem: CartItem = {
            id: generateId(),
            product,
            quantity,
            unitPrice: product.price,
            totalPrice: quantity * product.price,
          };
          newItems = [...cart.items, newItem];
        }

        // Recalculate totals
        const subtotal = calculateSubtotal(newItems);
        const tax = calculateTax(subtotal, mockSystemSettings.taxRate);
        const total = calculateTotal(subtotal, tax, cart.discount);

        set({
          cart: {
            ...cart,
            items: newItems,
            subtotal,
            tax,
            total,
          }
        });
      },

      removeFromCart: (itemId: string) => {
        const { cart } = get();
        const newItems = cart.items.filter(item => item.id !== itemId);
        
        const subtotal = calculateSubtotal(newItems);
        const tax = calculateTax(subtotal, mockSystemSettings.taxRate);
        const total = calculateTotal(subtotal, tax, cart.discount);

        set({
          cart: {
            ...cart,
            items: newItems,
            subtotal,
            tax,
            total,
          }
        });
      },

      updateCartItemQuantity: (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeFromCart(itemId);
          return;
        }

        const { cart } = get();
        const newItems = cart.items.map(item => 
          item.id === itemId 
            ? { 
                ...item, 
                quantity,
                totalPrice: quantity * item.unitPrice
              }
            : item
        );

        const subtotal = calculateSubtotal(newItems);
        const tax = calculateTax(subtotal, mockSystemSettings.taxRate);
        const total = calculateTotal(subtotal, tax, cart.discount);

        set({
          cart: {
            ...cart,
            items: newItems,
            subtotal,
            tax,
            total,
          }
        });
      },

      applyDiscount: (amount: number) => {
        const { cart } = get();
        const discount = Math.max(0, Math.min(amount, cart.subtotal)); // Ensure discount doesn't exceed subtotal
        const total = calculateTotal(cart.subtotal, cart.tax, discount);

        set({
          cart: {
            ...cart,
            discount,
            total,
          }
        });
      },

      clearCart: () => {
        set({ cart: initialCart });
      },

      // Transaction actions
      processTransaction: (paymentMethod: 'cash' | 'card', cashReceived?: number) => {
        const { cart } = get();
        
        if (cart.items.length === 0) {
          throw new Error('Cannot process empty cart');
        }

        if (paymentMethod === 'cash' && (!cashReceived || cashReceived < cart.total)) {
          throw new Error('Insufficient cash received');
        }

        const transaction: Transaction = {
          id: generateId(),
          items: [...cart.items],
          subtotal: cart.subtotal,
          tax: cart.tax,
          discount: cart.discount,
          total: cart.total,
          paymentMethod,
          cashierId: '1', // TODO: Get from auth store
          createdAt: new Date(),
          status: 'completed',
        };

        if (paymentMethod === 'cash' && cashReceived) {
          transaction.cashReceived = cashReceived;
          transaction.changeGiven = calculateChange(cart.total, cashReceived);
        }

        // Clear cart after successful transaction
        set({ cart: initialCart });

        // TODO: Update product stock quantities
        // TODO: Save transaction to database

        return transaction;
      },

      // Utility actions
      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      setError: (error: string | null) => {
        set({ error });
      },
    }),
    {
      name: 'pos-store',
    }
  )
);