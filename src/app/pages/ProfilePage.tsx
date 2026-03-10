import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db, Order } from '../../services/database';
import { useTranslation } from 'react-i18next';
import { User, Package, LogOut, ShoppingBag, Calendar, MapPin, Phone, Mail } from 'lucide-react';
import { motion } from 'motion/react';

export const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    
    const userOrders = db.getUserOrders(user.id);
    setOrders(userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  }, [user, navigate]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(t('profile.locale'), {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: Order['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
      shipped: 'bg-purple-100 text-purple-800 border-purple-300',
      delivered: 'bg-green-100 text-green-800 border-green-300'
    };
    return colors[status];
  };

  return (
    <div className="min-h-screen bg-stone-950 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl text-white mb-2">
            {t('profile.title')}
          </h1>
          <p className="text-stone-400">
            {t('profile.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* User Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-stone-900 shadow-sm p-6 sticky top-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-stone-700 flex items-center justify-center">
                  <User size={32} className="text-white" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl text-white">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="text-sm text-stone-400">
                    {t('profile.member')} {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                {user.email && (
                  <div className="flex items-center gap-3 text-stone-400">
                    <Mail size={18} className="text-stone-500" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                )}
                {user.phone && (
                  <div className="flex items-center gap-3 text-stone-400">
                    <Phone size={18} className="text-stone-500" />
                    <span className="text-sm">{user.phone}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-stone-800 pt-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-stone-800">
                    <div className="text-2xl font-bold text-white">
                      {orders.length}
                    </div>
                    <div className="text-xs text-stone-400 mt-1">
                      {t('profile.totalOrders')}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-stone-800">
                    <div className="text-2xl font-bold text-white">
                      {t('products.currency')}{orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                    </div>
                    <div className="text-xs text-stone-400 mt-1">
                      {t('profile.totalSpent')}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full bg-white hover:bg-stone-100 text-stone-900 py-3 transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut size={18} />
                  {t('profile.logout')}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Orders History */}
          <div className="lg:col-span-2">
            <div className="bg-stone-900 shadow-sm p-6">
              <h2 className="font-serif text-2xl text-white mb-6 flex items-center gap-2">
                <Package size={24} className="text-stone-400" />
                {t('profile.orderHistory')}
              </h2>

              {orders.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingBag size={64} className="text-stone-600 mx-auto mb-4" />
                  <p className="text-stone-400 text-lg mb-2">
                    {t('profile.noOrders')}
                  </p>
                  <p className="text-stone-500 text-sm mb-6">
                    {t('profile.noOrdersDesc')}
                  </p>
                  <button
                    onClick={() => navigate('/')}
                    className="bg-white hover:bg-stone-100 text-stone-900 px-6 py-3 transition-colors"
                  >
                    {t('profile.startShopping')}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-stone-800 p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-white">
                              {t('profile.orderNumber')} #{order.id.slice(0, 8)}
                            </h3>
                            <span className={`text-xs px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                              {t(`profile.status.${order.status}`)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-stone-400">
                            <Calendar size={14} />
                            {formatDate(order.createdAt)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-white">
                            {t('products.currency')}{order.total.toFixed(2)}
                          </div>
                          <div className="text-xs text-stone-400">
                            {order.items.reduce((sum, item) => sum + item.quantity, 0)} {t('profile.items')}
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-stone-800 pt-4">
                        <h4 className="text-sm font-semibold text-stone-300 mb-3">
                          {t('profile.orderItems')}:
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {order.items.map((item) => (
                            <div
                              key={item.product.id}
                              className="flex items-center gap-3 bg-stone-800 p-3"
                            >
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-12 h-12 object-contain bg-stone-900 rounded p-1"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                  {item.product.name}
                                </p>
                                <p className="text-xs text-stone-400">
                                  {item.quantity} Г— {t('products.currency')}{item.product.price.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-stone-800 pt-4 mt-4">
                        <h4 className="text-sm font-semibold text-stone-300 mb-2">
                          {t('profile.deliveryAddress')}:
                        </h4>
                        <div className="flex items-start gap-2 text-sm text-stone-400">
                          <MapPin size={16} className="text-stone-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p>{order.customerInfo.firstName} {order.customerInfo.lastName}</p>
                            <p>{order.customerInfo.phone}</p>
                            <p>{order.customerInfo.address}</p>
                            <p className="text-xs text-stone-500 mt-1">
                              {order.customerInfo.country}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
