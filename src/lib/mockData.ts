import { Product, User, Category, Transaction, CartItem } from '@/types';
import { generateId, generateSKU, generateBarcode, toCents, fromCents, formatCurrency } from '@/utils';

// Mock Categories
export const mockCategories: Category[] = [
  { id: '1', name: 'Whiskey', description: 'All types of whiskey', isActive: true },
  { id: '2', name: 'Vodka', description: 'Premium and standard vodkas', isActive: true },
  { id: '3', name: 'Wine', description: 'Red, white, and sparkling wines', isActive: true },
  { id: '4', name: 'Beer', description: 'Domestic and imported beers', isActive: true },
  { id: '5', name: 'Rum', description: 'Light and dark rums', isActive: true },
  { id: '6', name: 'Gin', description: 'London dry and flavored gins', isActive: true },
  { id: '7', name: 'Tequila', description: 'Blanco, reposado, and añejo', isActive: true },
  { id: '8', name: 'Liqueur', description: 'Flavored spirits and liqueurs', isActive: true },
];

// Mock Products
export const mockProducts: Product[] = [
  // Whiskey
  {
    id: '1',
    name: 'Jack Daniels Old No. 7',
    category: 'Whiskey',
    sku: 'JACDA001',
    barcode: '080686001737',
    brand: 'Jack Daniels',
    volumeMl: 750,
    price: 24.99,
    cost: 18.50,
    stockQuantity: 45,
    minStockLevel: 10,
    isActive: true,
    imageUrl: '/images/jack-daniels.jpg',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Jameson Irish Whiskey',
    category: 'Whiskey',
    sku: 'JAMIR001',
    barcode: '080686001744',
    brand: 'Jameson',
    volumeMl: 750,
    price: 29.99,
    cost: 22.00,
    stockQuantity: 32,
    minStockLevel: 8,
    isActive: true,
    imageUrl: '/images/jameson.jpg',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '3',
    name: 'Crown Royal Canadian Whisky',
    category: 'Whiskey',
    sku: 'CRORO001',
    barcode: '080686001751',
    brand: 'Crown Royal',
    volumeMl: 750,
    price: 32.99,
    cost: 24.50,
    stockQuantity: 28,
    minStockLevel: 5,
    isActive: true,
    imageUrl: '/images/crown-royal.jpg',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  
  // Vodka
  {
    id: '4',
    name: 'Grey Goose Vodka',
    category: 'Vodka',
    sku: 'GREVO001',
    barcode: '080686001768',
    brand: 'Grey Goose',
    volumeMl: 750,
    price: 42.99,
    cost: 32.00,
    stockQuantity: 24,
    minStockLevel: 6,
    isActive: true,
    imageUrl: '/images/grey-goose.jpg',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '5',
    name: 'Absolut Vodka',
    category: 'Vodka',
    sku: 'ABSVO001',
    barcode: '080686001775',
    brand: 'Absolut',
    volumeMl: 750,
    price: 19.99,
    cost: 14.50,
    stockQuantity: 58,
    minStockLevel: 15,
    isActive: true,
    imageUrl: '/images/absolut.jpg',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '6',
    name: 'Tito\'s Handmade Vodka',
    category: 'Vodka',
    sku: 'TITVO001',
    barcode: '080686001782',
    brand: 'Tito\'s',
    volumeMl: 750,
    price: 21.99,
    cost: 16.00,
    stockQuantity: 41,
    minStockLevel: 12,
    isActive: true,
    imageUrl: '/images/titos.jpg',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  
  // Wine
  {
    id: '7',
    name: 'Kendall-Jackson Vintner\'s Reserve Chardonnay',
    category: 'Wine',
    sku: 'KENCHA001',
    barcode: '080686001799',
    brand: 'Kendall-Jackson',
    volumeMl: 750,
    price: 18.99,
    cost: 13.50,
    stockQuantity: 36,
    minStockLevel: 8,
    isActive: true,
    imageUrl: '/images/kj-chardonnay.jpg',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '8',
    name: 'Caymus Cabernet Sauvignon',
    category: 'Wine',
    sku: 'CAYCAB001',
    barcode: '080686001806',
    brand: 'Caymus',
    volumeMl: 750,
    price: 89.99,
    cost: 65.00,
    stockQuantity: 12,
    minStockLevel: 3,
    isActive: true,
    imageUrl: '/images/caymus.jpg',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  
  // Beer
  {
    id: '9',
    name: 'Corona Extra 12-Pack',
    category: 'Beer',
    sku: 'CORBEE001',
    barcode: '080686001813',
    brand: 'Corona',
    volumeMl: 4440, // 12 x 370ml
    price: 14.99,
    cost: 11.00,
    stockQuantity: 85,
    minStockLevel: 20,
    isActive: true,
    imageUrl: '/images/corona-12pack.jpg',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '10',
    name: 'Heineken 6-Pack',
    category: 'Beer',
    sku: 'HEIBEE001',
    barcode: '080686001820',
    brand: 'Heineken',
    volumeMl: 2220, // 6 x 370ml
    price: 9.99,
    cost: 7.25,
    stockQuantity: 92,
    minStockLevel: 25,
    isActive: true,
    imageUrl: '/images/heineken-6pack.jpg',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  
  // Rum
  {
    id: '11',
    name: 'Bacardi Superior White Rum',
    category: 'Rum',
    sku: 'BACRUM001',
    barcode: '080686001837',
    brand: 'Bacardi',
    volumeMl: 750,
    price: 16.99,
    cost: 12.50,
    stockQuantity: 47,
    minStockLevel: 12,
    isActive: true,
    imageUrl: '/images/bacardi-white.jpg',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '12',
    name: 'Captain Morgan Spiced Rum',
    category: 'Rum',
    sku: 'CAPRUM001',
    barcode: '080686001844',
    brand: 'Captain Morgan',
    volumeMl: 750,
    price: 19.99,
    cost: 14.75,
    stockQuantity: 38,
    minStockLevel: 10,
    isActive: true,
    imageUrl: '/images/captain-morgan.jpg',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  
  // Gin
  {
    id: '13',
    name: 'Tanqueray London Dry Gin',
    category: 'Gin',
    sku: 'TANGIN001',
    barcode: '080686001851',
    brand: 'Tanqueray',
    volumeMl: 750,
    price: 22.99,
    cost: 17.00,
    stockQuantity: 31,
    minStockLevel: 8,
    isActive: true,
    imageUrl: '/images/tanqueray.jpg',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '14',
    name: 'Bombay Sapphire Gin',
    category: 'Gin',
    sku: 'BOMGIN001',
    barcode: '080686001868',
    brand: 'Bombay',
    volumeMl: 750,
    price: 24.99,
    cost: 18.50,
    stockQuantity: 26,
    minStockLevel: 6,
    isActive: true,
    imageUrl: '/images/bombay-sapphire.jpg',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  
  // Tequila
  {
    id: '15',
    name: 'Patron Silver Tequila',
    category: 'Tequila',
    sku: 'PATTEG001',
    barcode: '080686001875',
    brand: 'Patron',
    volumeMl: 750,
    price: 49.99,
    cost: 37.50,
    stockQuantity: 18,
    minStockLevel: 4,
    isActive: true,
    imageUrl: '/images/patron-silver.jpg',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '16',
    name: 'Jose Cuervo Especial Gold',
    category: 'Tequila',
    sku: 'JOSTEG001',
    barcode: '080686001882',
    brand: 'Jose Cuervo',
    volumeMl: 750,
    price: 17.99,
    cost: 13.25,
    stockQuantity: 43,
    minStockLevel: 10,
    isActive: true,
    imageUrl: '/images/jose-cuervo.jpg',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  
  // Low stock items for testing alerts
  {
    id: '17',
    name: 'Dom Pérignon Champagne',
    category: 'Wine',
    sku: 'DOMCHA001',
    barcode: '080686001899',
    brand: 'Dom Pérignon',
    volumeMl: 750,
    price: 199.99,
    cost: 150.00,
    stockQuantity: 2, // Low stock
    minStockLevel: 5,
    isActive: true,
    imageUrl: '/images/dom-perignon.jpg',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '18',
    name: 'Macallan 18 Year Old',
    category: 'Whiskey',
    sku: 'MACWHI001',
    barcode: '080686001906',
    brand: 'Macallan',
    volumeMl: 750,
    price: 449.99,
    cost: 350.00,
    stockQuantity: 1, // Critical stock
    minStockLevel: 3,
    isActive: true,
    imageUrl: '/images/macallan-18.jpg',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
];

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@liquorstore.com',
    role: 'admin',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    username: 'manager',
    email: 'manager@liquorstore.com',
    role: 'manager',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '3',
    username: 'cashier1',
    email: 'cashier1@liquorstore.com',
    role: 'cashier',
    isActive: true,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
  },
  {
    id: '4',
    username: 'cashier2',
    email: 'cashier2@liquorstore.com',
    role: 'cashier',
    isActive: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
];

// Helper function to create mock transactions
export function createMockTransaction(
  products: Product[],
  cashierId: string,
  daysAgo: number = 0
): Transaction {
  const transactionDate = new Date();
  transactionDate.setDate(transactionDate.getDate() - daysAgo);
  
  // Random number of items (1-5)
  const numItems = Math.floor(Math.random() * 5) + 1;
  const selectedProducts = products
    .sort(() => 0.5 - Math.random())
    .slice(0, numItems);
  
  const items: CartItem[] = selectedProducts.map(product => {
    const quantity = Math.floor(Math.random() * 3) + 1;
    const unitPrice = product.price;
    const totalPrice = quantity * unitPrice;
    
    return {
      id: generateId(),
      product,
      quantity,
      unitPrice,
      totalPrice,
    };
  });
  
  // Calculate totals in cents for precision
  const subtotalInCents = items.reduce((sum, item) => sum + toCents(item.totalPrice), 0);
  const taxInCents = Math.round(subtotalInCents * 0.08); // 8% tax, rounded to nearest cent
  const totalInCents = subtotalInCents + taxInCents;
  
  const paymentMethods: Array<'cash' | 'card'> = ['cash', 'card'];
  const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
  
  const transaction: Transaction = {
    id: generateId(),
    items,
    subtotal: fromCents(subtotalInCents),
    tax: fromCents(taxInCents),
    discount: 0,
    total: fromCents(totalInCents),
    paymentMethod,
    cashierId,
    createdAt: transactionDate,
    status: 'completed',
  };
  
  if (paymentMethod === 'cash') {
    // Add some realistic cash received amounts (round up to nearest $5)
    const cashReceivedInCents = Math.ceil(totalInCents / 500) * 500;
    transaction.cashReceived = fromCents(cashReceivedInCents);
    transaction.changeGiven = fromCents(cashReceivedInCents - totalInCents);
  }
  
  return transaction;
}

// Generate some mock transactions for the last 30 days
export function generateMockTransactions(count: number = 100): Transaction[] {
  const transactions: Transaction[] = [];
  
  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 30); // Last 30 days
    const cashierId = mockUsers[Math.floor(Math.random() * mockUsers.length)].id;
    transactions.push(createMockTransaction(mockProducts, cashierId, daysAgo));
  }
  
  return transactions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

// Default system settings
export const mockSystemSettings = {
  storeName: 'Premium Liquor Store',
  storeAddress: '123 Main Street, Anytown, USA 12345',
  taxRate: 8.0,
  currency: 'USD',
  receiptHeader: 'Thank you for shopping with us!',
  receiptFooter: 'Please drink responsibly. Returns accepted within 30 days with receipt.',
  lowStockThreshold: 10,
};