import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Product, Cart, CartItem, Transaction, POSState } from '@/types';
import { 
  calculateSubtotal, 
  calculateTax, 
  calculateTotal, 
  calculateChange,
  calculateDiscountAmount,
  toCents,
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
  applyDiscount: (discountPercent: number) => void;
  applyFixedDiscount: (discountAmountInDollars: number) => void;
  
  // Helper functions
  recalculateDiscountAmount: (cart: Cart, newSubtotal: number) => { discount: number, discountPercentage: number | undefined };
  
  // Transaction actions
  processTransaction: (paymentMethod: 'cash' | 'card', cashReceivedInDollars?: number) => Transaction;
  
  // Utility actions
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

// NOTE: All monetary values in the Cart are stored in CENTS (integers)
// This includes: subtotal, tax, discount, total, unitPrice, totalPrice
const initialCart: Cart = {
  items: [],
  subtotal: 0, // in cents
  tax: 0,      // in cents
  discount: 0, // in cents
  discountPercentage: undefined, // percentage for display
  total: 0,    // in cents
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
        
        // Instant search for UI demo (no artificial delays)
        if (query.trim() === '') {
          set({ searchResults: mockProducts.slice(0, 20), isLoading: false });
          return;
        }

        const results = mockProducts.filter(product => {
          const searchText = `${product.name} ${product.brand} ${product.category} ${product.sku}`.toLowerCase();
          return fuzzySearch(query, searchText) && product.isActive;
        });

        set({ searchResults: results, isLoading: false });
      },

      setSelectedProduct: (product: Product | null) => {
        set({ selectedProduct: product });
      },

      clearSearch: () => {
        set({ searchQuery: '', searchResults: [], selectedProduct: null });
      },

      // Helper function to recalculate discount amount when subtotal changes (for percentage-based discounts)
      recalculateDiscountAmount: (cart: Cart, newSubtotal: number) => {
        // If there was a percentage-based discount applied, maintain the percentage and recalculate the amount
        if (cart.discountPercentage !== undefined) {
          // When subtotal is 0, discount amount should also be 0, but keep the percentage
          if (newSubtotal === 0) {
            return { 
              discount: 0, 
              discountPercentage: cart.discountPercentage // Keep original percentage for when cart is refilled
            };
          }
          
          const newDiscountAmount = calculateDiscountAmount(newSubtotal, cart.discountPercentage);
          // Ensure discount doesn't exceed subtotal
          const finalDiscountAmount = Math.min(newDiscountAmount, newSubtotal);
          return { 
            discount: finalDiscountAmount, 
            discountPercentage: cart.discountPercentage // Keep original percentage
          };
        }
        // For fixed discounts, ensure they don't exceed the new subtotal
        const cappedFixedDiscount = Math.min(cart.discount, newSubtotal);
        return { 
          discount: cappedFixedDiscount, 
          discountPercentage: cart.discountPercentage 
        };
      },

      // Cart actions
      addToCart: (product: Product, quantity: number = 1) => {
        const { cart } = get();
        
        // Convert product price to cents for internal calculations
        const unitPriceInCents = toCents(product.price);
        
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
                  totalPrice: (item.quantity + quantity) * item.unitPrice // in cents
                }
              : item
          );
        } else {
          // Add new item to cart
          const newItem: CartItem = {
            id: generateId(),
            product,
            quantity,
            unitPrice: unitPriceInCents,     // STORED IN CENTS
            totalPrice: quantity * unitPriceInCents, // STORED IN CENTS
          };
          newItems = [...cart.items, newItem];
        }

        // Recalculate totals (all in cents)
        const subtotalInCents = calculateSubtotal(
          newItems.map((item: CartItem) => ({ 
            quantity: item.quantity, 
            unitPriceInCents: item.unitPrice 
          }))
        );
        const taxInCents = calculateTax(subtotalInCents, mockSystemSettings.taxRate);
        
        // Recalculate discount amount if applicable
        const updatedDiscountAmount = get().recalculateDiscountAmount(cart, subtotalInCents);
        const totalInCents = calculateTotal(subtotalInCents, taxInCents, updatedDiscountAmount.discount);

        set({
          cart: {
            ...cart,
            items: newItems,
            subtotal: subtotalInCents, // in cents
            tax: taxInCents,          // in cents
            total: totalInCents,      // in cents
            discount: updatedDiscountAmount.discount, // in cents
            discountPercentage: updatedDiscountAmount.discountPercentage,
          }
        });
      },

      removeFromCart: (itemId: string) => {
        const { cart } = get();
        const newItems = cart.items.filter(item => item.id !== itemId);
        
        const subtotalInCents = calculateSubtotal(
          newItems.map((item: CartItem) => ({ 
            quantity: item.quantity, 
            unitPriceInCents: item.unitPrice 
          }))
        );
        const taxInCents = calculateTax(subtotalInCents, mockSystemSettings.taxRate);
        
        // Recalculate discount amount if applicable
        const updatedDiscountAmount = get().recalculateDiscountAmount(cart, subtotalInCents);
        const totalInCents = calculateTotal(subtotalInCents, taxInCents, updatedDiscountAmount.discount);

        set({
          cart: {
            ...cart,
            items: newItems,
            subtotal: subtotalInCents,
            tax: taxInCents,
            total: totalInCents,
            discount: updatedDiscountAmount.discount,
            discountPercentage: updatedDiscountAmount.discountPercentage,
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
                totalPrice: quantity * item.unitPrice // in cents
              }
            : item
        );

        const subtotalInCents = calculateSubtotal(
          newItems.map((item: CartItem) => ({ 
            quantity: item.quantity, 
            unitPriceInCents: item.unitPrice 
          }))
        );
        const taxInCents = calculateTax(subtotalInCents, mockSystemSettings.taxRate);
        
        // Recalculate discount amount if applicable
        const updatedDiscountAmount = get().recalculateDiscountAmount(cart, subtotalInCents);
        const totalInCents = calculateTotal(subtotalInCents, taxInCents, updatedDiscountAmount.discount);

        set({
          cart: {
            ...cart,
            items: newItems,
            subtotal: subtotalInCents,
            tax: taxInCents,
            total: totalInCents,
            discount: updatedDiscountAmount.discount,
            discountPercentage: updatedDiscountAmount.discountPercentage,
          }
        });
      },

      applyDiscount: (discountPercent: number) => {
        const { cart } = get();
        // Calculate discount on subtotal (before tax)
        const discountInCents = calculateDiscountAmount(cart.subtotal, discountPercent);
        // Ensure discount doesn't exceed subtotal
        const finalDiscountInCents = Math.min(discountInCents, cart.subtotal);
        const totalInCents = calculateTotal(cart.subtotal, cart.tax, finalDiscountInCents);

        set({
          cart: {
            ...cart,
            discount: finalDiscountInCents, // in cents
            discountPercentage: discountPercent, // store percentage for display
            total: totalInCents,           // in cents
          }
        });
      },

      applyFixedDiscount: (discountAmountInDollars: number) => {
        const { cart } = get();
        const discountInCents = toCents(discountAmountInDollars);
        // Ensure discount doesn't exceed subtotal
        const finalDiscountInCents = Math.max(0, Math.min(discountInCents, cart.subtotal));
        const totalInCents = calculateTotal(cart.subtotal, cart.tax, finalDiscountInCents);

        set({
          cart: {
            ...cart,
            discount: finalDiscountInCents,
            discountPercentage: undefined, // no percentage for fixed discount
            total: totalInCents,
          }
        });
      },

      clearCart: () => {
        set({ cart: initialCart });
      },

      // Transaction actions
      processTransaction: (paymentMethod: 'cash' | 'card', cashReceivedInDollars?: number) => {
        const { cart } = get();
        
        if (cart.items.length === 0) {
          throw new Error('Cannot process empty cart');
        }

        const cashReceivedInCents = cashReceivedInDollars ? toCents(cashReceivedInDollars) : undefined;

        if (paymentMethod === 'cash' && (!cashReceivedInCents || cashReceivedInCents < cart.total)) {
          throw new Error('Insufficient cash received');
        }

        const transaction: Transaction = {
          id: generateId(),
          items: [...cart.items], // Items contain prices in cents
          subtotal: cart.subtotal, // in cents
          tax: cart.tax,          // in cents
          discount: cart.discount, // in cents
          discountPercentage: cart.discountPercentage, // store percentage for historical records
          total: cart.total,      // in cents
          paymentMethod,
          cashierId: '1', // Hard-coded for UI demo
          createdAt: new Date(),
          status: 'completed',
        };

        if (paymentMethod === 'cash' && cashReceivedInCents) {
          transaction.cashReceived = cashReceivedInCents;  // in cents
          transaction.changeGiven = calculateChange(cart.total, cashReceivedInCents); // in cents
        }

        // Clear cart after successful transaction
        set({ cart: initialCart });

        // In a real app, this would save to database and update inventory
        // For UI demo, we just return the transaction
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