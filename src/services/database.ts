// Local Storage Database Service

export interface User {
  id: string;
  email?: string;
  phone?: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export type CareMethod = 'whitening' | 'sensitive' | 'gums' | 'natural' | 'kids' | 'pregnant' | 'premium' | 'complete' | 'fresh';

export type Ingredient = 'fluoride' | 'hydroxyapatite' | 'xylitol' | 'calcium' | 'vitaminE' | 
  'diamondPowder' | 'gold24k' | 'activatedCharcoal' | 'vitaminB12' | 'folicAcid' | 
  'geranium' | 'chamomile' | 'sage' | 'eucalyptus' | 'liatris' | 'hexetidine' |
  'biosol' | 'krameria' | 'calendula' | 'commiphoraMyrrh' | 'vitaminB5' | 
  'calciumGlycerophosphate' | 'mica' | 'sodiumHyaluronate' | 'colloidalSilver' |
  'cetrariaIslandica' | 'cardamomOil' | 'peppermintOil' | 'zincChloride' | 'ratania';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  image: string;
  isNew?: boolean;
  badge?: 'bestseller' | 'recommended' | 'topSales' | 'eco' | 'limitedStock';
  careMethod?: CareMethod[];
  ingredients?: Ingredient[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  customerInfo: {
    firstName: string;
    lastName: string;
    email?: string;
    phone: string;
    country: string;
    address: string;
    city?: string;
    warehouse?: string;
  };
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface ProductOverride {
  id: string;
  price?: number;
  badge?: string;
  hidden?: boolean;
  name?: string;
}

export interface CustomProduct {
  id: string;
  name: string;
  categoryKey: string;
  price: number;
  description: string;
  image: string;
  badge?: string;
  isNew?: boolean;
  createdAt: string;
}

class Database {
  private readonly USERS_KEY = 'dentissimo_users';
  private readonly ORDERS_KEY = 'dentissimo_orders';
  private readonly CURRENT_USER_KEY = 'dentissimo_current_user';
  private readonly PRODUCT_OVERRIDES_KEY = 'dentissimo_product_overrides';
  private readonly CUSTOM_PRODUCTS_KEY = 'dentissimo_custom_products';
  private readonly ADMIN_SESSION_KEY = 'dentissimo_admin_session';

  // User Management
  createUser(email: string | undefined, phone: string | undefined, firstName: string, lastName: string): User {
    const users = this.getUsers();
    const user: User = {
      id: this.generateId(),
      email,
      phone,
      firstName,
      lastName,
      createdAt: new Date().toISOString()
    };
    users.push(user);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    return user;
  }

  getUsers(): User[] {
    try {
      const data = localStorage.getItem(this.USERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  findUserByEmail(email: string): User | undefined {
    return this.getUsers().find(u => u.email === email);
  }

  findUserByPhone(phone: string): User | undefined {
    return this.getUsers().find(u => u.phone === phone);
  }

  setCurrentUser(user: User): void {
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
  }

  getCurrentUser(): User | null {
    try {
      const data = localStorage.getItem(this.CURRENT_USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }

  // Order Management
  createOrder(order: Omit<Order, 'id' | 'createdAt'>): Order {
    const orders = this.getOrders();
    const newOrder: Order = {
      ...order,
      id: this.generateId(),
      createdAt: new Date().toISOString()
    };
    orders.push(newOrder);
    localStorage.setItem(this.ORDERS_KEY, JSON.stringify(orders));
    return newOrder;
  }

  getOrders(): Order[] {
    try {
      const data = localStorage.getItem(this.ORDERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  getUserOrders(userId: string): Order[] {
    return this.getOrders().filter(order => order.userId === userId);
  }

  updateOrderStatus(orderId: string, status: Order['status']): void {
    const orders = this.getOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx !== -1) {
      orders[idx].status = status;
      localStorage.setItem(this.ORDERS_KEY, JSON.stringify(orders));
    }
  }

  deleteOrder(orderId: string): void {
    const orders = this.getOrders().filter(o => o.id !== orderId);
    localStorage.setItem(this.ORDERS_KEY, JSON.stringify(orders));
  }

  // Product Overrides
  getProductOverrides(): ProductOverride[] {
    try {
      const data = localStorage.getItem(this.PRODUCT_OVERRIDES_KEY);
      return data ? JSON.parse(data) : [];
    } catch { return []; }
  }

  setProductOverride(override: ProductOverride): void {
    const overrides = this.getProductOverrides();
    const idx = overrides.findIndex(o => o.id === override.id);
    if (idx !== -1) overrides[idx] = override;
    else overrides.push(override);
    localStorage.setItem(this.PRODUCT_OVERRIDES_KEY, JSON.stringify(overrides));
  }

  deleteProductOverride(id: string): void {
    const overrides = this.getProductOverrides().filter(o => o.id !== id);
    localStorage.setItem(this.PRODUCT_OVERRIDES_KEY, JSON.stringify(overrides));
  }

  // Custom Products
  getCustomProducts(): CustomProduct[] {
    try {
      const data = localStorage.getItem(this.CUSTOM_PRODUCTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch { return []; }
  }

  saveCustomProduct(product: Omit<CustomProduct, 'id' | 'createdAt'>): CustomProduct {
    const products = this.getCustomProducts();
    const newProduct: CustomProduct = {
      ...product,
      id: `custom-${this.generateId().slice(0, 8)}`,
      createdAt: new Date().toISOString()
    };
    products.push(newProduct);
    localStorage.setItem(this.CUSTOM_PRODUCTS_KEY, JSON.stringify(products));
    return newProduct;
  }

  updateCustomProduct(id: string, data: Partial<CustomProduct>): void {
    const products = this.getCustomProducts();
    const idx = products.findIndex(p => p.id === id);
    if (idx !== -1) {
      products[idx] = { ...products[idx], ...data };
      localStorage.setItem(this.CUSTOM_PRODUCTS_KEY, JSON.stringify(products));
    }
  }

  deleteCustomProduct(id: string): void {
    const products = this.getCustomProducts().filter(p => p.id !== id);
    localStorage.setItem(this.CUSTOM_PRODUCTS_KEY, JSON.stringify(products));
  }

  // Admin session
  isAdminLoggedIn(): boolean {
    return localStorage.getItem(this.ADMIN_SESSION_KEY) === 'true';
  }

  setAdminSession(val: boolean): void {
    if (val) localStorage.setItem(this.ADMIN_SESSION_KEY, 'true');
    else localStorage.removeItem(this.ADMIN_SESSION_KEY);
  }

  // Utility
  private generateId(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const db = new Database();
