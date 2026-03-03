// Local Storage Database Service

export interface User {
  id: string;
  email?: string;
  phone?: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  image: string;
  isNew?: boolean;
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
    phone: string;
    country: string;
    address: string;
  };
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: string;
}

class Database {
  private readonly USERS_KEY = 'dentissimo_users';
  private readonly ORDERS_KEY = 'dentissimo_orders';
  private readonly CURRENT_USER_KEY = 'dentissimo_current_user';

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

  // Utility
  private generateId(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const db = new Database();
