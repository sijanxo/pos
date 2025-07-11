// User and Authentication Types
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'cashier' | 'manager' | 'admin';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Product and Inventory Types
export interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  barcode?: string;
  brand: string;
  volumeMl: number;
  price: number;
  cost: number;
  stockQuantity: number;
  minStockLevel: number;
  isActive: boolean;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

// Cart and Transaction Types
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  discountPercentage?: number; // Store the percentage for display
  total: number;
}

export interface Transaction {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  discountPercentage?: number; // Store percentage for historical records
  total: number;
  paymentMethod: 'cash' | 'card' | 'split';
  cashReceived?: number;
  changeGiven?: number;
  cashierId: string;
  customerId?: string;
  createdAt: Date;
  status: 'completed' | 'pending' | 'cancelled' | 'refunded';
}

// Inventory Management Types
export interface InventoryAdjustment {
  id: string;
  productId: string;
  adjustmentType: 'add' | 'remove' | 'set';
  quantity: number;
  reason: string;
  userId: string;
  createdAt: Date;
}

export interface StockAlert {
  id: string;
  productId: string;
  productName: string;
  currentStock: number;
  minStockLevel: number;
  severity: 'low' | 'critical';
  createdAt: Date;
}

// Payment Types
export interface Payment {
  id: string;
  transactionId: string;
  method: 'cash' | 'card';
  amount: number;
  createdAt: Date;
}

// Report Types
export interface SalesReport {
  date: string;
  totalSales: number;
  totalTransactions: number;
  averageTransaction: number;
  paymentMethods: {
    cash: number;
    card: number;
  };
  topProducts: Array<{
    productId: string;
    productName: string;
    quantitySold: number;
    revenue: number;
  }>;
}

export interface InventoryReport {
  totalProducts: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  topCategories: Array<{
    category: string;
    value: number;
    quantity: number;
  }>;
}

// Search and Filter Types
export interface SearchFilters {
  query: string;
  category?: string;
  brand?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  inStock?: boolean;
}

// Settings Types
export interface SystemSettings {
  storeName: string;
  storeAddress: string;
  taxRate: number;
  currency: string;
  receiptHeader: string;
  receiptFooter: string;
  lowStockThreshold: number;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form Types
export interface ProductFormData {
  name: string;
  category: string;
  sku: string;
  barcode?: string;
  brand: string;
  volumeMl: number;
  price: number;
  cost: number;
  stockQuantity: number;
  minStockLevel: number;
}

export interface UserFormData {
  username: string;
  email: string;
  role: 'cashier' | 'manager' | 'admin';
  password?: string;
}

// UI State Types
export interface POSState {
  cart: Cart;
  selectedProduct: Product | null;
  searchQuery: string;
  searchResults: Product[];
  isLoading: boolean;
  error: string | null;
}

// Dashboard Types
export interface DashboardStats {
  todaySales: number;
  todayTransactions: number;
  lowStockAlerts: number;
  totalProducts: number;
  totalCustomers: number;
}