import { useState, useEffect } from 'react';
import { db, Order, ProductOverride, CustomProduct } from '../../services/database';
import { orderService, checkSupabaseSetup } from '../../services/orderService';
import { allProducts as baseProducts } from '../../data/allProducts';
import {
  LayoutDashboard, ShoppingBag, Package, Users, LogOut, Lock,
  ChevronDown, ChevronUp, Check, XCircle,
  PlusCircle, Pencil, Trash2, Eye, EyeOff, Save, X, AlertTriangle, RefreshCw
} from 'lucide-react';

// в”Ђв”Ђв”Ђ Admin password в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
const ADMIN_PASSWORD = 'Dentissimo@admin25';

// в”Ђв”Ђв”Ђ Helpers в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
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
  pending: 'РќРѕРІРµ', confirmed: 'РџС–РґС‚РІРµСЂРґР¶РµРЅРѕ', shipped: 'Р’С–РґРїСЂР°РІР»РµРЅРѕ',
  delivered: 'Р”РѕСЃС‚Р°РІР»РµРЅРѕ', cancelled: 'РЎРєР°СЃРѕРІР°РЅРѕ',
};

const BadgeStyle = 'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium';

// в”Ђв”Ђв”Ђ COMPONENTS в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ

interface StatCardProps { label: string; value: string | number; sub?: string; color?: string; }
const StatCard = ({ label, value, sub, color = 'text-stone-900 dark:text-white' }: StatCardProps) => (
  <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-6">
    <p className="text-xs text-stone-500 uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-3xl font-bold ${color}`}>{value}</p>
    {sub && <p className="text-xs text-stone-400 mt-1">{sub}</p>}
  </div>
);

// в”Ђв”Ђв”Ђ ADMIN PAGE в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ

export const AdminPage = () => {
  const [loggedIn, setLoggedIn] = useState(() => db.isAdminLoggedIn());
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'products' | 'customers'>('dashboard');
  const [supabaseError, setSupabaseError] = useState<string | null>(null);

  useEffect(() => {
    if (!loggedIn) return;
    checkSupabaseSetup().then(err => setSupabaseError(err));
  }, [loggedIn]);

  // в”Ђв”Ђ Login в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      db.setAdminSession(true);
      setLoggedIn(true);
    } else {
      setLoginError('РќРµРІС–СЂРЅРёР№ РїР°СЂРѕР»СЊ');
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
            <div className="w-14 h-14 bg-sky-100 border border-sky-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock size={24} className="text-stone-300" />
            </div>
            <h1 className="font-serif text-2xl text-white">Dentissimo Admin</h1>
            <p className="text-stone-400 text-sm mt-1">РџР°РЅРµР»СЊ РєРµСЂСѓРІР°РЅРЅСЏ</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setLoginError(''); }}
              placeholder="РџР°СЂРѕР»СЊ"
              className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white placeholder-stone-500 focus:outline-none focus:border-sky-400"
            />
            {loginError && (
              <p className="text-red-400 text-sm flex items-center gap-1">
                <AlertTriangle size={14} /> {loginError}
              </p>
            )}
            <button type="submit" className="w-full py-3 bg-stone-700 hover:bg-stone-600 text-white font-semibold rounded-lg transition-colors">
              РЈРІС–Р№С‚Рё
            </button>
          </form>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Р”Р°С€Р±РѕСЂРґ', icon: LayoutDashboard },
    { id: 'orders', label: 'Р—Р°РјРѕРІР»РµРЅРЅСЏ', icon: ShoppingBag },
    { id: 'products', label: 'РџСЂРѕРґСѓРєС‚Рё', icon: Package },
    { id: 'customers', label: 'РљР»С–С”РЅС‚Рё', icon: Users },
  ] as const;

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 flex flex-col">
      {/* Top nav */}
      <header className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 px-6 py-3 flex items-center justify-between sticky top-0 z-40">
        <span className="font-serif text-xl text-stone-900 dark:text-white tracking-wide">Dentissimo <span className="text-stone-500 text-sm font-medium">Admin</span></span>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-1">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-white' : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-white'}`}>
                <tab.icon size={15} /> {tab.label}
              </button>
            ))}
          </div>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-stone-500 hover:text-red-500 text-sm transition-colors">
            <LogOut size={15} /> Р’РёР№С‚Рё
          </button>
        </div>
      </header>

      {/* Mobile tabs */}
      <div className="md:hidden flex gap-1 p-3 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 overflow-x-auto">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${activeTab === tab.id ? 'bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-white' : 'text-stone-500'}`}>
            <tab.icon size={13} /> {tab.label}
          </button>
        ))}
      </div>

      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        {supabaseError && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950 border border-red-300 dark:border-red-800 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="text-red-500 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-red-700 dark:text-red-400">Supabase РЅРµ РїС–РґРєР»СЋС‡РµРЅРёР№ вЂ” Р·Р°РјРѕРІР»РµРЅРЅСЏ РЅРµ Р·Р±РµСЂС–РіР°СЋС‚СЊСЃСЏ РІ Р±Р°Р·С–!</p>
                <p className="text-red-600 dark:text-red-500 text-sm mt-1 break-all">РџРѕРјРёР»РєР°: {supabaseError}</p>
                <details className="mt-3">
                  <summary className="text-sm text-red-600 dark:text-red-400 cursor-pointer font-medium">РЇРє РІРёРїСЂР°РІРёС‚Рё вЂ” Р·Р°РїСѓСЃС‚Рё С†РµР№ SQL РІ Supabase</summary>
                  <pre className="mt-2 p-3 bg-stone-900 text-green-400 text-xs rounded-lg overflow-x-auto whitespace-pre-wrap">{`-- 1. Р’С–РґРєСЂРёР№ app.supabase.com в†’ С‚РІС–Р№ РїСЂРѕРµРєС‚ в†’ SQL Editor
-- 2. Р’СЃС‚Р°РІ С†РµР№ РєРѕРґ С– РЅР°С‚РёСЃРЅРё Run:

create table if not exists orders (
  id text primary key,
  user_id text,
  items jsonb not null,
  total numeric not null,
  customer_info jsonb not null,
  status text not null default 'pending',
  created_at timestamptz default now()
);
alter table orders enable row level security;
create policy "allow_all" on orders for all using (true) with check (true);`}</pre>
                </details>
              </div>
              <button onClick={() => checkSupabaseSetup().then(err => setSupabaseError(err))} className="text-red-400 hover:text-red-600 shrink-0">
                <RefreshCw size={16} />
              </button>
            </div>
          </div>
        )}
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'orders' && <OrdersTab />}
        {activeTab === 'products' && <ProductsTab />}
        {activeTab === 'customers' && <CustomersTab />}
      </main>
    </div>
  );
};

// в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ
//  DASHBOARD TAB
// в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ
const DashboardTab = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState(db.getUsers());
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const data = await orderService.getOrders();
    setOrders(data);
    setCustomers(db.getUsers());
    setLoading(false);
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
        <h2 className="text-xl font-semibold text-stone-900 dark:text-white">РћРіР»СЏРґ</h2>
        <button onClick={refresh} className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> РћРЅРѕРІРёС‚Рё
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Р—Р°РјРѕРІР»РµРЅСЊ" value={orders.length} sub={`${pending} РЅРѕРІРёС…`} />
        <StatCard label="Р’РёСЂСѓС‡РєР°" value={`в‚ґ${revenue.toLocaleString('uk-UA', { maximumFractionDigits: 0 })}`} color="text-green-600" />
        <StatCard label="РљР»С–С”РЅС‚С–РІ" value={customers.length} />
        <StatCard label="РџСЂРѕРґСѓРєС‚С–РІ" value={baseProducts.length + db.getCustomProducts().length} />
      </div>

      {/* Recent orders */}
      <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
        <div className="px-6 py-4 border-b border-stone-100 dark:border-stone-800">
          <h3 className="font-semibold text-stone-900 dark:text-white">РћСЃС‚Р°РЅРЅС– Р·Р°РјРѕРІР»РµРЅРЅСЏ</h3>
        </div>
        <div className="divide-y divide-stone-100 dark:divide-stone-800">
          {orders.slice(0, 8).map(order => (
            <div key={order.id} className="px-6 py-3 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-stone-900 dark:text-white">{order.customerInfo.firstName} {order.customerInfo.lastName}</p>
                <p className="text-xs text-stone-400">{fmt(order.createdAt)}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-stone-900 dark:text-white text-sm">в‚ґ{order.total.toFixed(0)}</span>
                <span className={`${BadgeStyle} ${statusColors[order.status]}`}>{statusLabels[order.status]}</span>
              </div>
            </div>
          ))}
          {orders.length === 0 && <p className="px-6 py-8 text-center text-stone-400 text-sm">Р—Р°РјРѕРІР»РµРЅСЊ С‰Рµ РЅРµРјР°С”</p>}
        </div>
      </div>
    </div>
  );
};

// в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ
//  ORDERS TAB
// в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ
const OrdersTab = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<'all' | Order['status']>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    const data = await orderService.getOrders();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
    const onFocus = () => refresh();
    window.addEventListener('focus', onFocus);
    const interval = setInterval(refresh, 10000);
    return () => { window.removeEventListener('focus', onFocus); clearInterval(interval); };
  }, []);

  const setStatus = async (id: string, status: Order['status']) => {
    await orderService.updateStatus(id, status);
    refresh();
  };

  const deleteOrder = async (id: string) => {
    if (confirm('Р’РёРґР°Р»РёС‚Рё Р·Р°РјРѕРІР»РµРЅРЅСЏ?')) { await orderService.deleteOrder(id); refresh(); }
  };

  const shown = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const filterTabs: { id: 'all' | Order['status']; label: string }[] = [
    { id: 'all', label: 'Р’СЃС–' },
    { id: 'pending', label: 'РќРѕРІС–' },
    { id: 'confirmed', label: 'РџС–РґС‚РІРµСЂРґР¶РµРЅРѕ' },
    { id: 'shipped', label: 'Р’С–РґРїСЂР°РІР»РµРЅРѕ' },
    { id: 'delivered', label: 'Р”РѕСЃС‚Р°РІР»РµРЅРѕ' },
    { id: 'cancelled', label: 'РЎРєР°СЃРѕРІР°РЅРѕ' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-stone-900 dark:text-white">Р—Р°РјРѕРІР»РµРЅРЅСЏ</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-stone-400">{shown.length} Р·Р°РїРёСЃС–РІ</span>
          <button onClick={refresh} className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> РћРЅРѕРІРёС‚Рё
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {filterTabs.map(ft => (
          <button key={ft.id} onClick={() => setFilter(ft.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === ft.id ? 'bg-stone-900 text-white' : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-stone-500'}`}>
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
                <p className="text-xs text-stone-400">{fmt(order.createdAt)} В· {order.items.length} С‚РѕРІР°СЂС–РІ</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-stone-900 dark:text-white">в‚ґ{order.total.toFixed(0)}</span>
                {expandedId === order.id ? <ChevronUp size={16} className="text-stone-400" /> : <ChevronDown size={16} className="text-stone-400" />}
              </div>
            </div>

            {/* Expanded details */}
            {expandedId === order.id && (
              <div className="border-t border-stone-100 dark:border-stone-800 px-5 py-4 space-y-4">
                {/* Customer info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-xs text-stone-400 uppercase tracking-wide font-medium">РљР»С–С”РЅС‚</p>
                    <p className="text-stone-900 dark:text-white">{order.customerInfo.firstName} {order.customerInfo.lastName}</p>
                    {order.customerInfo.email && <p className="text-stone-600 dark:text-stone-300">{order.customerInfo.email}</p>}
                    <p className="text-stone-600 dark:text-stone-300">{order.customerInfo.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-stone-400 uppercase tracking-wide font-medium">Р”РѕСЃС‚Р°РІРєР°</p>
                    <p className="text-stone-900 dark:text-white">{order.customerInfo.country}</p>
                    <p className="text-stone-600 dark:text-stone-300">{order.customerInfo.address}</p>
                    {order.customerInfo.city && <p className="text-stone-600 dark:text-stone-300">{order.customerInfo.city}</p>}
                    {order.customerInfo.warehouse && <p className="text-stone-600 dark:text-stone-300">{order.customerInfo.warehouse}</p>}
                  </div>
                </div>

                {/* Items */}
                <div>
                  <p className="text-xs text-stone-400 uppercase tracking-wide font-medium mb-2">РўРѕРІР°СЂРё</p>
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-2 bg-stone-50 dark:bg-stone-800/50 rounded-lg">
                        <img src={item.product.image} alt={item.product.name} className="w-10 h-10 object-contain rounded" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-stone-900 dark:text-white truncate">{item.product.name}</p>
                          <p className="text-xs text-stone-400">Г—{item.quantity}</p>
                        </div>
                        <span className="text-sm font-semibold text-stone-900 dark:text-white">в‚ґ{(item.product.price * item.quantity).toFixed(0)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end mt-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                    <span className="font-bold text-stone-900 dark:text-white">Р Р°Р·РѕРј: в‚ґ{order.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Status change */}
                <div>
                  <p className="text-xs text-stone-400 uppercase tracking-wide font-medium mb-2">Р—РјС–РЅРёС‚Рё СЃС‚Р°С‚СѓСЃ</p>
                  <div className="flex flex-wrap gap-2">
                    {(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] as const).map(s => (
                      <button key={s} onClick={() => setStatus(order.id, s)} disabled={order.status === s}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${order.status === s ? `${statusColors[s]} border-transparent cursor-default` : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:border-stone-500 hover:text-stone-900 dark:hover:text-white'}`}>
                        {order.status === s && <Check size={11} className="inline mr-1" />}
                        {statusLabels[s]}
                      </button>
                    ))}
                    <button onClick={() => deleteOrder(order.id)} className="px-3 py-1.5 rounded-lg text-xs font-medium border border-red-200 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors ml-auto">
                      <Trash2 size={11} className="inline mr-1" /> Р’РёРґР°Р»РёС‚Рё
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        {shown.length === 0 && (
          <div className="text-center py-16 text-stone-400 text-sm bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <RefreshCw size={16} className="animate-spin" /> Р—Р°РІР°РЅС‚Р°Р¶РµРЅРЅСЏвЂ¦
              </div>
            ) : 'Р—Р°РјРѕРІР»РµРЅСЊ РЅРµ Р·РЅР°Р№РґРµРЅРѕ'}
          </div>
        )}
      </div>
    </div>
  );
};

// в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ
//  PRODUCTS TAB
// в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ
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
    if (confirm('Р’РёРґР°Р»РёС‚Рё РїСЂРѕРґСѓРєС‚?')) { db.deleteCustomProduct(id); refresh(); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-stone-900 dark:text-white">РџСЂРѕРґСѓРєС‚Рё</h2>
        <button onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-sm font-medium transition-colors">
          <PlusCircle size={15} /> Р”РѕРґР°С‚Рё РїСЂРѕРґСѓРєС‚
        </button>
      </div>

      {/* Add product form */}
      {showAddForm && (
        <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-300 p-6">
          <h3 className="font-semibold text-stone-900 dark:text-white mb-4">РќРѕРІРёР№ РїСЂРѕРґСѓРєС‚</h3>
          <form onSubmit={addCustomProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-stone-500 block mb-1">РќР°Р·РІР° *</label>
              <input value={newProduct.name} onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))} required
                className="w-full px-3 py-2 border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white rounded-lg text-sm focus:outline-none focus:border-sky-400" />
            </div>
            <div>
              <label className="text-xs text-stone-500 block mb-1">Р¦С–РЅР° (в‚ґ) *</label>
              <input type="number" value={newProduct.price} onChange={e => setNewProduct(p => ({ ...p, price: e.target.value }))} required
                className="w-full px-3 py-2 border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white rounded-lg text-sm focus:outline-none focus:border-sky-400" />
            </div>
            <div>
              <label className="text-xs text-stone-500 block mb-1">РљР°С‚РµРіРѕСЂС–СЏ</label>
              <select value={newProduct.categoryKey} onChange={e => setNewProduct(p => ({ ...p, categoryKey: e.target.value }))}
                className="w-full px-3 py-2 border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white rounded-lg text-sm focus:outline-none focus:border-sky-400">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-stone-500 block mb-1">Р‘РµР№РґР¶</label>
              <select value={newProduct.badge} onChange={e => setNewProduct(p => ({ ...p, badge: e.target.value }))}
                className="w-full px-3 py-2 border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white rounded-lg text-sm focus:outline-none focus:border-sky-400">
                {BADGES.map(b => <option key={b} value={b}>{b || '(Р±РµР· Р±РµР№РґР¶Сѓ)'}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-stone-500 block mb-1">URL Р·РѕР±СЂР°Р¶РµРЅРЅСЏ</label>
              <input value={newProduct.image} onChange={e => setNewProduct(p => ({ ...p, image: e.target.value }))} placeholder="/images/..."
                className="w-full px-3 py-2 border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white rounded-lg text-sm focus:outline-none focus:border-sky-400" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-stone-500 block mb-1">РћРїРёСЃ</label>
              <textarea value={newProduct.description} onChange={e => setNewProduct(p => ({ ...p, description: e.target.value }))} rows={3}
                className="w-full px-3 py-2 border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white rounded-lg text-sm focus:outline-none focus:border-sky-400 resize-none" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isNew" checked={newProduct.isNew} onChange={e => setNewProduct(p => ({ ...p, isNew: e.target.checked }))} className="accent-stone-900" />
              <label htmlFor="isNew" className="text-sm text-stone-700 dark:text-stone-300">РџРѕР·РЅР°С‡РёС‚Рё СЏРє "РќРѕРІРёРЅРєР°"</label>
            </div>
            <div className="md:col-span-2 flex gap-3 justify-end pt-2">
              <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 text-sm border border-stone-200 dark:border-stone-700 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors">РЎРєР°СЃСѓРІР°С‚Рё</button>
              <button type="submit" className="px-4 py-2 text-sm bg-stone-900 hover:bg-stone-800 text-white rounded-lg transition-colors font-medium">Р”РѕРґР°С‚Рё</button>
            </div>
          </form>
        </div>
      )}

      {/* Section tabs */}
      <div className="flex gap-2">
        <button onClick={() => setActiveSection('base')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === 'base' ? 'bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-white' : 'text-stone-500 dark:text-stone-400 hover:text-stone-800'}`}>
          РљР°С‚Р°Р»РѕРі ({baseProducts.length})
        </button>
        <button onClick={() => setActiveSection('custom')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === 'custom' ? 'bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-white' : 'text-stone-500 dark:text-stone-400 hover:text-stone-800'}`}>
          Р”РѕРґР°РЅС– ({customs.length})
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
                        <input value={editValues.name} onChange={e => setEditValues(v => ({ ...v, name: e.target.value }))} placeholder="РќР°Р·РІР°" className="w-36 px-2 py-1 text-xs border border-stone-300 dark:border-stone-600 rounded bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:border-sky-400" />
                        <input type="number" value={editValues.price} onChange={e => setEditValues(v => ({ ...v, price: e.target.value }))} placeholder="Р¦С–РЅР° в‚ґ" className="w-24 px-2 py-1 text-xs border border-stone-300 dark:border-stone-600 rounded bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:border-sky-400" />
                        <select value={editValues.badge} onChange={e => setEditValues(v => ({ ...v, badge: e.target.value }))} className="px-2 py-1 text-xs border border-stone-300 dark:border-stone-600 rounded bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:border-sky-400">
                          {BADGES.map(b => <option key={b} value={b}>{b || 'Р±РµР· Р±РµР№РґР¶Сѓ'}</option>)}
                        </select>
                        <button onClick={() => saveEdit(p.id)} className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"><Save size={13} /></button>
                        <button onClick={() => setEditingId(null)} className="p-1.5 bg-stone-100 text-stone-600 rounded hover:bg-stone-200 transition-colors"><X size={13} /></button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-medium text-stone-900 dark:text-white truncate">{displayName}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-stone-500">в‚ґ{displayPrice} В· {p.categoryKey}</span>
                          {displayBadge && <span className="text-xs bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 px-1.5 py-0.5 rounded">{displayBadge}</span>}
                          {hasOverride && <span className="text-xs bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 px-1.5 py-0.5 rounded">Р·РјС–РЅРµРЅРѕ</span>}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {!isEditing && (
                      <>
                        <button onClick={() => startEdit({ id: p.id, name: displayName, price: displayPrice, badge: displayBadge })} title="Р РµРґР°РіСѓРІР°С‚Рё" className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 rounded transition-colors"><Pencil size={14} /></button>
                        <button onClick={() => toggleHide(p.id)} title={isHidden ? 'РџРѕРєР°Р·Р°С‚Рё' : 'РЎС…РѕРІР°С‚Рё'} className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800 rounded transition-colors">
                          {isHidden ? <Eye size={14} /> : <EyeOff size={14} />}
                        </button>
                        {hasOverride && <button onClick={() => resetOverride(p.id)} title="РЎРєРёРЅСѓС‚Рё Р·РјС–РЅРё" className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition-colors"><XCircle size={14} /></button>}
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
            <p className="text-center py-12 text-stone-400 text-sm">Р”РѕРґР°С‚РєРѕРІРёС… РїСЂРѕРґСѓРєС‚С–РІ РЅРµРјР°С”. РќР°С‚РёСЃРЅС–С‚СЊ "Р”РѕРґР°С‚Рё РїСЂРѕРґСѓРєС‚".</p>
          ) : (
            <div className="divide-y divide-stone-100 dark:divide-stone-800">
              {customs.map(p => (
                <div key={p.id} className="px-4 py-3 flex items-center gap-3">
                  <img src={p.image} alt={p.name} className="w-10 h-10 object-contain rounded flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-900 dark:text-white truncate">{p.name}</p>
                    <p className="text-xs text-stone-500">в‚ґ{p.price} В· {p.categoryKey} В· {fmt(p.createdAt)}</p>
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

// в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ
//  CUSTOMERS TAB
// в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ
const CustomersTab = () => {
  const customers = db.getUsers();
  const orders = db.getOrders();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-stone-900 dark:text-white">РљР»С–С”РЅС‚Рё</h2>
        <span className="text-sm text-stone-400">{customers.length} РєР»С–С”РЅС‚С–РІ</span>
      </div>
      <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden">
        {customers.length === 0 ? (
          <p className="text-center py-12 text-stone-400 text-sm">Р—Р°СЂРµС”СЃС‚СЂРѕРІР°РЅРёС… РєР»С–С”РЅС‚С–РІ С‰Рµ РЅРµРјР°С”</p>
        ) : (
          <div className="divide-y divide-stone-100 dark:divide-stone-800">
            {customers.map(c => {
              const userOrders = orders.filter(o => o.userId === c.id);
              const spent = userOrders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);
              return (
                <div key={c.id} className="px-5 py-4 flex items-center gap-4">
                  <div className="w-9 h-9 bg-stone-200 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-stone-700 dark:text-stone-300 text-sm font-medium">{c.firstName[0]}{c.lastName[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-stone-900 dark:text-white">{c.firstName} {c.lastName}</p>
                    <p className="text-xs text-stone-400">
                      {c.email || c.phone} В· СЂРµС”СЃС‚СЂР°С†С–СЏ {fmt(c.createdAt)}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-stone-900 dark:text-white">в‚ґ{spent.toFixed(0)}</p>
                    <p className="text-xs text-stone-400">{userOrders.length} Р·Р°РјРѕРІР».</p>
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
