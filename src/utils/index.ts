import { clsx, type ClassValue } from 'clsx';

// Utility function for combining CSS classes
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Currency formatting
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

// Date formatting
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

// Tax calculations
export function calculateTax(amount: number, taxRate: number): number {
  return Number((amount * (taxRate / 100)).toFixed(2));
}

export function calculateSubtotal(items: Array<{ quantity: number; unitPrice: number }>): number {
  return Number(items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0).toFixed(2));
}

export function calculateTotal(subtotal: number, tax: number, discount: number = 0): number {
  return Number((subtotal + tax - discount).toFixed(2));
}

// Change calculation
export function calculateChange(total: number, cashReceived: number): number {
  return Number((cashReceived - total).toFixed(2));
}

// String utilities
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function generateSKU(name: string, brand: string): string {
  const nameCode = name.substring(0, 3).toUpperCase();
  const brandCode = brand.substring(0, 2).toUpperCase();
  const randomCode = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${nameCode}${brandCode}${randomCode}`;
}

export function generateBarcode(): string {
  return Array.from({ length: 12 }, () => Math.floor(Math.random() * 10)).join('');
}

// Search utilities
export function fuzzySearch(query: string, text: string): boolean {
  const q = query.toLowerCase().trim();
  const t = text.toLowerCase();
  
  if (q === '') return true;
  if (t.includes(q)) return true;
  
  // Simple fuzzy matching - check if all characters in query exist in text in order
  let queryIndex = 0;
  for (let i = 0; i < t.length && queryIndex < q.length; i++) {
    if (t[i] === q[queryIndex]) {
      queryIndex++;
    }
  }
  return queryIndex === q.length;
}

// Validation utilities
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidSKU(sku: string): boolean {
  return /^[A-Z0-9]{5,10}$/.test(sku);
}

export function isValidBarcode(barcode: string): boolean {
  return /^[0-9]{8,13}$/.test(barcode);
}

export function isValidPrice(price: number): boolean {
  return price > 0 && Number.isFinite(price);
}

// Number utilities
export function roundToTwo(num: number): number {
  return Number(Math.round(Number(num + 'e2')) + 'e-2');
}

export function formatNumber(num: number, decimals: number = 2): string {
  return num.toFixed(decimals);
}

// Array utilities
export function sortByProperty<T>(array: T[], property: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[property];
    const bVal = b[property];
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}

export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const group = String(item[key]);
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

// Local storage utilities
export function setLocalStorage(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

export function getLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Failed to read from localStorage:', error);
    return defaultValue;
  }
}

export function removeLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to remove from localStorage:', error);
  }
}

// Performance utilities
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: unknown[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}