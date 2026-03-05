import { useState, useEffect } from 'react';
import { db, Order, ProductOverride, CustomProduct } from '../../services/database';
import { allProducts as baseProducts } from '../../data/allProducts';
import {
  LayoutDashboard, ShoppingBag, Package, Users, LogOut, Lock,
  ChevronDown, ChevronUp, Check, XCircle,
  PlusCircle, Pencil, Trash2, Eye, EyeOff, Save, X, AlertTriangle, RefreshCw
} from 'lucide-react';

// ─── Admin password ────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = 'Dentissimo@admin25';

// ─── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (iso: string) =>
  new Date(iso).toLocaleString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const statusColors: Record<string, string> = {
  pending:   'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  shipped:   'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};

const statusLabels: Record<string, string> = {
  pending: 'Нове', confirmed: 'Підтверджено', shipped: 'Відправлено',
  delivered: 'Доставлено', cancelled: 'Скасовано',
};

const BadgeStyle = 'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium';

// ─── COMPONENTS ────────────────────────────────────────────────────────────────

interface StatCardProps { label: string; value: string | number; sub?: string; color?: string; }
const StatCard = ({ label, value, sub, color = 'text-[#D4AF37]' }: StatCardProps) => (
  <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-6">
    <p className="text-xs text-stone-500 uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-3xl font-bold ${color}`}>{value}</p>
    {sub && <p className="text-xs text-stone-400 mt-1">{sub}</p>}
  </div>
);

// ─── ADMIN PAGE ────────────────────────────────────────────────────────────────

export const AdminPage = () => {
  const [loggedIn, setLoggedIn] = useState(() => db.isAdminLoggedIn());
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'products' | 'customers'>('dashboard');

  // ── Login ──────────────────────────────────────────────────────────────────
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      db.setAdminSession(true);
      setLoggedIn(true);
    } else {
      setLoginError('Невірний пароль');
    }
  };

  const handleLogout = () => {
    db.setAdminSession(false);
    setLoggedIn(false);
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-stone-900 rounded-2xl border border-stone-800 p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock size={24} className="text-[#D4AF37]" />
            </div>
            <h1 className="font-serif text-2xl text-white">Dentissimo Admin</h1>
            <p className="text-stone-400 text-sm mt-1">Панель керування</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setLoginError(''); }}
              placeholder="Пароль"
              className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white placeholder-stone-500 focus:outline-none focus:border-[#D4AF37]"
            />
            {loginError && (
              <p className="text-red-400 text-sm flex items-center gap-1">
                <AlertTriangle size={14} /> {loginError}
              </p>
            )}
            <button type="submit" className="w-full py-3 bg-[#D4AF37] hover:bg-[#B8960C] text-stone-950 font-semibold rounded-lg transition-colors">
              Увійти
            </button>
          </form>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Дашборд', icon: LayoutDashboard },
    { id: 'orders', label: 'Замовлення', icon: ShoppingBag },
    { id: 'products', label: 'Продукти', icon: Package },
    { id: 'customers', label: 'Клієнти', icon: Users },
  ] as const;

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 flex flex-col">
      {/* Top nav */}
      <header className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 px-6 py-3 flex items-center justify-between sticky top-0 z-40">
        <span className="font-serif text-xl text-stone-900 dark:text-white tracking-wide">Dentissimo <span className="text-[#D4AF37] text-sm font-sans font-medium">Admin</span></span>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-1">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-white'}`}>
                <tab.icon size={15} /> {tab.label}
              </button>
            ))}
          </div>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-stone-500 hover:text-red-500 text-sm transition-colors">
            <LogOut size={15} /> Вийти
          </button>
        </div>
      </header>

      {/* Mobile tabs */}
      <div className="md:hidden flex gap-1 p-3 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 overflow-x-auto">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${activeTab === tab.id ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'text-stone-500'}`}>
            <tab.icon size={13} /> {tab.label}
          </button>
        ))}
      </div>

      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'orders' && <OrdersTab />}
        {activeTab === 'products' && <ProductsTab />}
        {activeTab === 'customers' && <CustomersTab />}
      </main>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
//  DASHBOARD TAB
// ═══════════════════════════════════════════════════════════════════
const DashboardTab = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState(db.getUsers());

  const refresh = () => {
    setOrders(db.getOrders().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    setCustomers(db.getUsers());
  };

  useEffect(() => {
    refresh();
    const onFocus = () => refresh();
    window.addEventListener('focus', onFocus);
    const interval = setInterval(refresh, 10000);
    return () => { window.removeEventListener('focus', onFocus); clearInterval(interval); };
  }, []);

  const revenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);
  const pending = orders.filter(o => o.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-stone-900 dark:text-white">Огляд</h2>
        <button onClick={refresh} className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-[#D4AF37] transition-colors">
          <RefreshCw size={14} /> Оновити
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Замовлень" value={orders.length} sub={`${pending} нових`} />
        <StatCard label="Виручка" value={`₴${revenue.toLocaleString('uk-UA', { maximumFractionDigits: 0 })}`} color="text-green-600" />
        <StatCard label="Клієнтів" value={customers.length} />
        <StatCard label="Продуктів" value={baseProducts.length + db.getCustomProducts().length} />
      </div>

      {/* Recent orders */}
      <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
        <div className="px-6 py-4 border-b border-stone-100 dark:border-stone-800">
          <h3 className="font-semibold text-stone-900 dark:text-white">Останні замовлення</h3>
        </div>
        <div className="divide-y divide-stone-100 dark:divide-stone-800">
          {orders.slice(0, 8).map(order => (
            <div key={order.id} className="px-6 py-3 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-stone-900 dark:text-white">{order.customerInfo.firstName} {order.customerInfo.lastName}</p>
                <p className="text-xs text-stone-400">{fmt(order.createdAt)}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-stone-900 dark:text-white text-sm">₴{order.total.toFixed(0)}</span>
                <span className={`${BadgeStyle} ${statusColors[order.status]}`}>{statusLabels[order.status]}</span>
              </div>
            </div>
          ))}
          {orders.length === 0 && <p className="px-6 py-8 text-center text-stone-400 text-sm">Замовлень ще немає</p>}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
//  ORDERS TAB
// ═══════════════════════════════════════════════════════════════════
const OrdersTab = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<'all' | Order['status']>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const refresh = () => setOrders(db.getOrders().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));

  useEffect(() => {
    refresh();
    const onFocus = () => refresh();
    window.addEventListener('focus', onFocus);
    const interval = setInterval(refresh, 10000);
    return () => { window.removeEventListener('focus', onFocus); clearInterval(interval); };
  }, []);

  const setStatus = (id: string, status: Order['status']) => {
    db.updateOrderStatus(id, status);
    refresh();
  };

  const deleteOrder = (id: string) => {
    if (confirm('Видалити замовлення?')) { db.deleteOrder(id); refresh(); }
  };

  const shown = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const filterTabs: { id: 'all' | Order['status']; label: string }[] = [
    { id: 'all', label: 'Всі' },
    { id: 'pending', label: 'Нові' },
    { id: 'confirmed', label: 'Підтверджено' },
    { id: 'shipped', label: 'Відправлено' },
    { id: 'delivered', label: 'Доставлено' },
    { id: 'cancelled', label: 'Скасовано' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-stone-900 dark:text-white">Замовлення</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-stone-400">{shown.length} записів</span>
          <button onClick={refresh} className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-[#D4AF37] transition-colors">
            <RefreshCw size={14} /> Оновити
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {filterTabs.map(ft => (
          <button key={ft.id} onClick={() => setFilter(ft.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === ft.id ? 'bg-[#D4AF37] text-white' : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-[#D4AF37]'}`}>
            {ft.label} {ft.id !== 'all' && <span className="ml-1 opacity-70">{orders.filter(o => o.status === ft.id).length}</span>}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {shown.map(order => (
          <div key={order.id} className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden">
            {/* Order row */}
            <div className="px-5 py-4 flex flex-wrap items-center gap-3 cursor-pointer" onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs text-stone-400">{order.id.slice(0, 8)}</span>
                  <span className={`${BadgeStyle} ${statusColors[order.status]}`}>{statusLabels[order.status]}</span>
                </div>
                <p className="font-medium text-stone-900 dark:text-white mt-0.5">{order.customerInfo.firstName} {order.customerInfo.lastName}</p>
                <p className="text-xs text-stone-400">{fmt(order.createdAt)} · {order.items.length} товарів</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-stone-900 dark:text-white">₴{order.total.toFixed(0)}</span>
                {expandedId === order.id ? <ChevronUp size={16} className="text-stone-400" /> : <ChevronDown size={16} className="text-stone-400" />}
              </div>
            </div>

            {/* Expanded details */}
            {expandedId === order.id && (
              <div className="border-t border-stone-100 dark:border-stone-800 px-5 py-4 space-y-4">
                {/* Customer info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-xs text-stone-400 uppercase tracking-wide font-medium">Клієнт</p>
                    <p className="text-stone-900 dark:text-white">{order.customerInfo.firstName} {order.customerInfo.lastName}</p>
                    {order.customerInfo.email && <p className="text-stone-600 dark:text-stone-300">{order.customerInfo.email}</p>}
                    <p className="text-stone-600 dark:text-stone-300">{order.customerInfo.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-stone-400 uppercase tracking-wide font-medium">Доставка</p>
                    <p className="text-stone-900 dark:text-white">{order.customerInfo.country}</p>
                    <p className="text-stone-600 dark:text-stone-300">{order.customerInfo.address}</p>
                    {order.customerInfo.city && <p className="text-stone-600 dark:text-stone-300">{order.customerInfo.city}</p>}
                    {order.customerInfo.warehouse && <p className="text-stone-600 dark:text-stone-300">{order.customerInfo.warehouse}</p>}
                  </div>
                </div>

                {/* Items */}
                <div>
                  <p className="text-xs text-stone-400 uppercase tracking-wide font-medium mb-2">Товари</p>
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-2 bg-stone-50 dark:bg-stone-800/50 rounded-lg">
                        <img src={item.product.image} alt={item.product.name} className="w-10 h-10 object-contain rounded" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-stone-900 dark:text-white truncate">{item.product.name}</p>
                          <p className="text-xs text-stone-400">×{item.quantity}</p>
                        </div>
                        <span className="text-sm font-semibold text-stone-900 dark:text-white">₴{(item.product.price * item.quantity).toFixed(0)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end mt-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                    <span className="font-bold text-stone-900 dark:text-white">Разом: ₴{order.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Status change */}
                <div>
                  <p className="text-xs text-stone-400 uppercase tracking-wide font-medium mb-2">Змінити статус</p>
                  <div className="flex flex-wrap gap-2">
                    {(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] as const).map(s => (
                      <button key={s} onClick={() => setStatus(order.id, s)} disabled={order.status === s}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${order.status === s ? `${statusColors[s]} border-transparent cursor-default` : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:border-[#D4AF37] hover:text-[#D4AF37]'}`}>
                        {order.status === s && <Check size={11} className="inline mr-1" />}
                        {statusLabels[s]}
                      </button>
                    ))}
                    <button onClick={() => deleteOrder(order.id)} className="px-3 py-1.5 rounded-lg text-xs font-medium border border-red-200 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors ml-auto">
                      <Trash2 size={11} className="inline mr-1" /> Видалити
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        {shown.length === 0 && (
          <div className="text-center py-16 text-stone-400 text-sm bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
            Замовлень не знайдено
          </div>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
//  PRODUCTS TAB
// ═══════════════════════════════════════════════════════════════════
const CATEGORIES = ['limitedEdition', 'toothpaste', 'toothbrushes', 'mouthwash', 'kids'];
const BADGES = ['', 'bestseller', 'recommended', 'topSales', 'eco', 'limitedStock'];

const ProductsTab = () => {
  const [overrides, setOverrides] = useState<ProductOverride[]>(() => db.getProductOverrides());
  const [customs, setCustoms] = useState<CustomProduct[]>(() => db.getCustomProducts());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ price: string; badge: string; name: string }>({ price: '', badge: '', name: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', categoryKey: 'toothpaste', price: '', description: '', image: '', badge: '', isNew: false });
  const [activeSection, setActiveSection] = useState<'base' | 'custom'>('base');

  const refresh = () => {
    setOverrides(db.getProductOverrides());
    setCustoms(db.getCustomProducts());
  };

  const startEdit = (p: { id: string; name: string; price: number; badge?: string }) => {
    setEditingId(p.id);
    setEditValues({ price: String(p.price), badge: p.badge || '', name: p.name });
  };

  const saveEdit = (id: string) => {
    db.setProductOverride({ id, price: parseFloat(editValues.price) || undefined, badge: editValues.badge || undefined, name: editValues.name || undefined });
    setEditingId(null);
    refresh();
  };

  const toggleHide = (id: string) => {
    const ov = overrides.find(o => o.id === id);
    db.setProductOverride({ ...ov, id, hidden: !ov?.hidden });
    refresh();
  };

  const resetOverride = (id: string) => {
    db.deleteProductOverride(id);
    refresh();
  };

  const addCustomProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;
    db.saveCustomProduct({ name: newProduct.name, categoryKey: newProduct.categoryKey, price: parseFloat(newProduct.price), description: newProduct.description, image: newProduct.image || '/images/DENTISSIMO_box_Gentle_Care.webp', badge: newProduct.badge || undefined, isNew: newProduct.isNew });
    setNewProduct({ name: '', categoryKey: 'toothpaste', price: '', description: '', image: '', badge: '', isNew: false });
    setShowAddForm(false);
    refresh();
  };

  const deleteCustom = (id: string) => {
    if (confirm('Видалити продукт?')) { db.deleteCustomProduct(id); refresh(); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-stone-900 dark:text-white">Продукти</h2>
        <button onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#D4AF37] hover:bg-[#B8960C] text-white rounded-lg text-sm font-medium transition-colors">
          <PlusCircle size={15} /> Додати продукт
        </button>
      </div>

      {/* Add product form */}
      {showAddForm && (
        <div className="bg-white dark:bg-stone-900 rounded-xl border border-[#D4AF37]/40 p-6">
          <h3 className="font-semibold text-stone-900 dark:text-white mb-4">Новий продукт</h3>
          <form onSubmit={addCustomProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-stone-500 block mb-1">Назва *</label>
              <input value={newProduct.name} onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))} required
                className="w-full px-3 py-2 border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white rounded-lg text-sm focus:outline-none focus:border-[#D4AF37]" />
            </div>
            <div>
              <label className="text-xs text-stone-500 block mb-1">Ціна (₴) *</label>
              <input type="number" value={newProduct.price} onChange={e => setNewProduct(p => ({ ...p, price: e.target.value }))} required
                className="w-full px-3 py-2 border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white rounded-lg text-sm focus:outline-none focus:border-[#D4AF37]" />
            </div>
            <div>
              <label className="text-xs text-stone-500 block mb-1">Категорія</label>
              <select value={newProduct.categoryKey} onChange={e => setNewProduct(p => ({ ...p, categoryKey: e.target.value }))}
                className="w-full px-3 py-2 border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white rounded-lg text-sm focus:outline-none focus:border-[#D4AF37]">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-stone-500 block mb-1">Бейдж</label>
              <select value={newProduct.badge} onChange={e => setNewProduct(p => ({ ...p, badge: e.target.value }))}
                className="w-full px-3 py-2 border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white rounded-lg text-sm focus:outline-none focus:border-[#D4AF37]">
                {BADGES.map(b => <option key={b} value={b}>{b || '(без бейджу)'}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-stone-500 block mb-1">URL зображення</label>
              <input value={newProduct.image} onChange={e => setNewProduct(p => ({ ...p, image: e.target.value }))} placeholder="/images/..."
                className="w-full px-3 py-2 border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white rounded-lg text-sm focus:outline-none focus:border-[#D4AF37]" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-stone-500 block mb-1">Опис</label>
              <textarea value={newProduct.description} onChange={e => setNewProduct(p => ({ ...p, description: e.target.value }))} rows={3}
                className="w-full px-3 py-2 border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white rounded-lg text-sm focus:outline-none focus:border-[#D4AF37] resize-none" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isNew" checked={newProduct.isNew} onChange={e => setNewProduct(p => ({ ...p, isNew: e.target.checked }))} className="accent-[#D4AF37]" />
              <label htmlFor="isNew" className="text-sm text-stone-700 dark:text-stone-300">Позначити як "Новинка"</label>
            </div>
            <div className="md:col-span-2 flex gap-3 justify-end pt-2">
              <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 text-sm border border-stone-200 dark:border-stone-700 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors">Скасувати</button>
              <button type="submit" className="px-4 py-2 text-sm bg-[#D4AF37] hover:bg-[#B8960C] text-white rounded-lg transition-colors font-medium">Додати</button>
            </div>
          </form>
        </div>
      )}

      {/* Section tabs */}
      <div className="flex gap-2">
        <button onClick={() => setActiveSection('base')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === 'base' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'text-stone-500 dark:text-stone-400 hover:text-stone-800'}`}>
          Каталог ({baseProducts.length})
        </button>
        <button onClick={() => setActiveSection('custom')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === 'custom' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'text-stone-500 dark:text-stone-400 hover:text-stone-800'}`}>
          Додані ({customs.length})
        </button>
      </div>

      {/* Base products */}
      {activeSection === 'base' && (
        <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden">
          <div className="divide-y divide-stone-100 dark:divide-stone-800">
            {baseProducts.map(p => {
              const ov = overrides.find(o => o.id === p.id);
              const isHidden = ov?.hidden;
              const displayPrice = ov?.price ?? p.price;
              const displayBadge = ov?.badge ?? p.badge ?? '';
              const displayName = ov?.name ?? p.name;
              const isEditing = editingId === p.id;
              const hasOverride = !!ov && (ov.price !== undefined || ov.badge !== undefined || ov.name !== undefined || ov.hidden);

              return (
                <div key={p.id} className={`px-4 py-3 flex items-center gap-3 ${isHidden ? 'opacity-50' : ''}`}>
                  <img src={p.image} alt={p.name} className="w-10 h-10 object-contain rounded flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <div className="flex flex-wrap gap-2 items-center">
                        <input value={editValues.name} onChange={e => setEditValues(v => ({ ...v, name: e.target.value }))} placeholder="Назва" className="w-36 px-2 py-1 text-xs border border-stone-300 dark:border-stone-600 rounded bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:border-[#D4AF37]" />
                        <input type="number" value={editValues.price} onChange={e => setEditValues(v => ({ ...v, price: e.target.value }))} placeholder="Ціна ₴" className="w-24 px-2 py-1 text-xs border border-stone-300 dark:border-stone-600 rounded bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:border-[#D4AF37]" />
                        <select value={editValues.badge} onChange={e => setEditValues(v => ({ ...v, badge: e.target.value }))} className="px-2 py-1 text-xs border border-stone-300 dark:border-stone-600 rounded bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:border-[#D4AF37]">
                          {BADGES.map(b => <option key={b} value={b}>{b || 'без бейджу'}</option>)}
                        </select>
                        <button onClick={() => saveEdit(p.id)} className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"><Save size={13} /></button>
                        <button onClick={() => setEditingId(null)} className="p-1.5 bg-stone-100 text-stone-600 rounded hover:bg-stone-200 transition-colors"><X size={13} /></button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-medium text-stone-900 dark:text-white truncate">{displayName}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-stone-500">₴{displayPrice} · {p.categoryKey}</span>
                          {displayBadge && <span className="text-xs bg-[#D4AF37]/10 text-[#D4AF37] px-1.5 py-0.5 rounded">{displayBadge}</span>}
                          {hasOverride && <span className="text-xs bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 px-1.5 py-0.5 rounded">змінено</span>}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {!isEditing && (
                      <>
                        <button onClick={() => startEdit({ id: p.id, name: displayName, price: displayPrice, badge: displayBadge })} title="Редагувати" className="p-1.5 text-stone-400 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded transition-colors"><Pencil size={14} /></button>
                        <button onClick={() => toggleHide(p.id)} title={isHidden ? 'Показати' : 'Сховати'} className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800 rounded transition-colors">
                          {isHidden ? <Eye size={14} /> : <EyeOff size={14} />}
                        </button>
                        {hasOverride && <button onClick={() => resetOverride(p.id)} title="Скинути зміни" className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition-colors"><XCircle size={14} /></button>}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Custom products */}
      {activeSection === 'custom' && (
        <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden">
          {customs.length === 0 ? (
            <p className="text-center py-12 text-stone-400 text-sm">Додаткових продуктів немає. Натисніть "Додати продукт".</p>
          ) : (
            <div className="divide-y divide-stone-100 dark:divide-stone-800">
              {customs.map(p => (
                <div key={p.id} className="px-4 py-3 flex items-center gap-3">
                  <img src={p.image} alt={p.name} className="w-10 h-10 object-contain rounded flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-900 dark:text-white truncate">{p.name}</p>
                    <p className="text-xs text-stone-500">₴{p.price} · {p.categoryKey} · {fmt(p.createdAt)}</p>
                  </div>
                  <button onClick={() => deleteCustom(p.id)} className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition-colors"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
//  CUSTOMERS TAB
// ═══════════════════════════════════════════════════════════════════
const CustomersTab = () => {
  const customers = db.getUsers();
  const orders = db.getOrders();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-stone-900 dark:text-white">Клієнти</h2>
        <span className="text-sm text-stone-400">{customers.length} клієнтів</span>
      </div>
      <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden">
        {customers.length === 0 ? (
          <p className="text-center py-12 text-stone-400 text-sm">Зареєстрованих клієнтів ще немає</p>
        ) : (
          <div className="divide-y divide-stone-100 dark:divide-stone-800">
            {customers.map(c => {
              const userOrders = orders.filter(o => o.userId === c.id);
              const spent = userOrders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);
              return (
                <div key={c.id} className="px-5 py-4 flex items-center gap-4">
                  <div className="w-9 h-9 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-[#D4AF37] text-sm font-medium">{c.firstName[0]}{c.lastName[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-stone-900 dark:text-white">{c.firstName} {c.lastName}</p>
                    <p className="text-xs text-stone-400">
                      {c.email || c.phone} · реєстрація {fmt(c.createdAt)}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-stone-900 dark:text-white">₴{spent.toFixed(0)}</p>
                    <p className="text-xs text-stone-400">{userOrders.length} замовл.</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
