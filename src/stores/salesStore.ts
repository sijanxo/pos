import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Define the structure for sale data - all monetary values stored in CENTS
export interface SaleData {
  id: string;
  saleDate: string;
  totalAmount: number; // in cents
  taxAmount: number; // in cents
  discountAmount: number; // in cents
  paymentMethod: 'cash' | 'card';
  cashierId: string;
  isRefund: boolean;
  originalSaleId: string | null;
  changeGiven: number; // in cents
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    priceAtSale: number; // in cents
    costAtSale: number; // in cents
    appliedDiscount: number; // in cents
    finalLineTotal: number; // in cents
  }>;
}

interface SalesStore {
  // State
  salesHistory: SaleData[];
  
  // Actions
  addSale: (saleData: SaleData) => void;
  getSaleById: (id: string) => SaleData | undefined;
  getSalesByDateRange: (startDate: string, endDate: string) => SaleData[];
  clearSalesHistory: () => void;
  
  // Computed values
  getTotalSales: () => number;
  getTodaysSales: () => SaleData[];
  getTotalRevenue: () => number;
}

export const useSalesStore = create<SalesStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      salesHistory: [],

      // Actions
      addSale: (saleData: SaleData) => {
        set((state) => ({
          salesHistory: [...state.salesHistory, saleData],
        }));
      },

      getSaleById: (id: string) => {
        const { salesHistory } = get();
        return salesHistory.find(sale => sale.id === id);
      },

      getSalesByDateRange: (startDate: string, endDate: string) => {
        const { salesHistory } = get();
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        return salesHistory.filter(sale => {
          const saleDate = new Date(sale.saleDate);
          return saleDate >= start && saleDate <= end;
        });
      },

      clearSalesHistory: () => {
        set({ salesHistory: [] });
      },

      // Computed values
      getTotalSales: () => {
        const { salesHistory } = get();
        return salesHistory.length;
      },

      getTodaysSales: () => {
        const { salesHistory } = get();
        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
        
        return salesHistory.filter(sale => {
          const saleDate = new Date(sale.saleDate);
          return saleDate >= todayStart && saleDate < todayEnd;
        });
      },

      getTotalRevenue: () => {
        const { salesHistory } = get();
        return salesHistory.reduce((total: number, sale: SaleData) => total + sale.totalAmount, 0);
      },
    }),
    {
      name: 'sales-store',
    }
  )
);

// Helper hooks for common sales operations
export const useSalesHistory = () => {
  return useSalesStore(state => state.salesHistory);
};

export const useAddSale = () => {
  return useSalesStore(state => state.addSale);
};

export const useTotalSales = () => {
  return useSalesStore(state => state.getTotalSales());
};

export const useTodaysSales = () => {
  return useSalesStore(state => state.getTodaysSales());
};

export const useTotalRevenue = () => {
  return useSalesStore(state => state.getTotalRevenue());
};

export const useSaleById = (id: string) => {
  return useSalesStore(state => state.getSaleById(id));
};