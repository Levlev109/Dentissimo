import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { db } from '../../services/database';
import { orderService } from '../../services/orderService';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Loader2, ArrowLeft, ShoppingBag } from 'lucide-react';
import { NovaPoshtaSelector } from '../components/NovaPoshtaSelector';

// ─────────────────────────────────────────────────────────────────────────────
//  EmailJS configuration
//  1. Register at https://www.emailjs.com  (free plan — 200 emails/month)
//  2. Add Email Service  →  copy Service ID  → paste below
//  3. Create Email Template with variables listed in the comment below
//     Subject:  New order #{{order_id}} — Dentissimo
//     Body (example):
//       Order: {{order_id}}
//       Customer: {{customer_name}}
//       Email: {{customer_email}}
//       Phone: {{customer_phone}}
//       Country: {{customer_country}}
//       Address: {{customer_address}}
//       Items: {{order_items}}
//       Total: {{order_total}}
//  4. Copy Template ID → paste below
//  5. Go to Account → API Keys → copy Public Key → paste below
// ─────────────────────────────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID  = 'service_w9vtqcr';
const EMAILJS_TEMPLATE_ID = 'template_gi3wb9g';
const EMAILJS_PUBLIC_KEY  = 'D7hfuMgGWEizH_23r';
const OWNER_EMAIL         = 'starovlev11@gmail.com';

// Input sanitization — strip HTML tags and limit length
const sanitize = (str: string, maxLen = 200): string =>
  str.replace(/<[^>]*>/g, '').trim().slice(0, maxLen);



export const CheckoutPage = () => {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [sending, setSending] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName:  user?.lastName  || '',
    email:     user?.email     || '',
    phone:     user?.phone     || '+380 ',
    country:   'UA',
    address:   '',
    city:      '',
    warehouse: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName.trim()) newErrors.firstName = t('checkout.required');
    if (!formData.lastName.trim())  newErrors.lastName  = t('checkout.required');
    if (!formData.email.trim()) {
      newErrors.email = t('checkout.required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('checkout.invalidEmail');
    }
    if (!formData.phone.trim())   newErrors.phone   = t('checkout.required');
    if (!formData.city.trim())    newErrors.address  = t('checkout.required');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSending(true);
    try {
      const orderId = typeof crypto !== 'undefined' && crypto.randomUUID
        ? `ORD-${crypto.randomUUID().slice(0, 8).toUpperCase()}`
        : `ORD-${Date.now()}`;
      const countryLabel = '🇺🇦 Україна';
      const deliveryInfo = formData.city ? `${formData.city} → ${formData.warehouse}` : formData.address;
      const itemsText = items
        .map(i => `${i.product.name} × ${i.quantity} = ${t('products.currency')}${(i.product.price * i.quantity).toFixed(2)}`)
        .join('\n');

      // Sanitize inputs before storage
      const safe = {
        firstName: sanitize(formData.firstName, 50),
        lastName:  sanitize(formData.lastName, 50),
        email:     sanitize(formData.email, 100),
        phone:     sanitize(formData.phone, 30),
        country:   sanitize(formData.country, 5),
        address:   sanitize(formData.address, 300),
        city:      sanitize(formData.city, 100),
        warehouse: sanitize(formData.warehouse, 200),
      };

      // Save order to Supabase (+ localStorage fallback)
      await orderService.createOrder({
        userId: user?.id ?? 'guest',
        items,
        total,
        customerInfo: {
          firstName: safe.firstName,
          lastName:  safe.lastName,
          email:     safe.email,
          phone:     safe.phone,
          country:   'UA',
          address:   safe.city ? `${safe.city}, ${safe.warehouse}` : safe.address,
          city:      safe.city || undefined,
          warehouse: safe.warehouse || undefined,
        },
        status: 'pending',
      });

      // Send email notification to owner
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          order_id:         orderId,
          customer_name:    `${safe.firstName} ${safe.lastName}`,
          customer_email:   safe.email,
          customer_phone:   safe.phone,
          customer_country: countryLabel,
          customer_address: deliveryInfo,
          order_items:      itemsText,
          order_total:      `${t('products.currency')}${total.toFixed(2)}`,
          to_email:         OWNER_EMAIL,
        },
        EMAILJS_PUBLIC_KEY
      );

      clearCart();
      setOrderPlaced(true);
    } catch (_err) {
      // Order saved locally even if email fails — still show success
      clearCart();
      setOrderPlaced(true);
    } finally {
      setSending(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] dark:bg-stone-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-stone-900 rounded-2xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="font-serif text-3xl text-stone-900 dark:text-white mb-2">
            {t('common.success')}!
          </h2>
          <p className="text-stone-600 dark:text-stone-400 mb-8">
            {t('checkout.orderSuccess')}
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3.5 bg-stone-900 text-white font-semibold rounded-xl hover:bg-stone-800 transition-all shadow-lg"
          >
            {t('cart.continueShopping')}
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] dark:bg-stone-950 flex items-center justify-center px-4">
        <div className="text-center">
          <ShoppingBag size={64} className="text-stone-300 dark:text-stone-600 mx-auto mb-4" />
          <h2 className="font-serif text-3xl text-stone-900 dark:text-white mb-4">
            {t('cart.empty')}
          </h2>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3.5 bg-stone-900 text-white font-semibold rounded-xl hover:bg-stone-800 transition-all shadow-lg"
          >
            {t('cart.continueShopping')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F8F6] dark:bg-stone-950 pt-28 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors mb-6 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          {t('cart.continueShopping')}
        </button>
        <h1 className="font-serif text-4xl text-stone-900 dark:text-white mb-8">
          {t('checkout.title')}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white dark:bg-stone-900 rounded-xl shadow-sm p-4 sm:p-8">
            <h2 className="font-serif text-2xl text-stone-900 dark:text-white mb-6">
              {t('checkout.personalInfo')}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                    {t('checkout.firstName')} *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className={`w-full px-4 py-3 border ${errors.firstName ? 'border-red-500' : 'border-stone-300'} rounded-lg bg-white text-stone-900 placeholder-stone-400 focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none`}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                    {t('checkout.lastName')} *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className={`w-full px-4 py-3 border ${errors.lastName ? 'border-red-500' : 'border-stone-300'} rounded-lg bg-white text-stone-900 placeholder-stone-400 focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none`}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                  {t('auth.email')} *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="example@mail.com"
                  className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-stone-300'} rounded-lg bg-white text-stone-900 placeholder-stone-400 focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>




              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                  {t('checkout.phone')} *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder={t('checkout.phonePlaceholder')}
                  className={`w-full px-4 py-3 border ${errors.phone ? 'border-red-500' : 'border-stone-300'} rounded-lg bg-white text-stone-900 placeholder-stone-400 focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <NovaPoshtaSelector
                  onSelect={(data) => {
                    setFormData(prev => ({
                      ...prev,
                      city:      data.city?.description || '',
                      warehouse: data.warehouse?.description || '',
                      address:   `${data.city?.description || ''}, ${data.warehouse?.description || ''}`,
                    }));
                    if (errors.address) setErrors(prev => ({ ...prev, address: '' }));
                  }}
                  cartTotal={total}
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full py-4 bg-stone-900 text-white font-semibold tracking-wide hover:bg-stone-800 transition-all rounded-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-base"
              >
                {sending && <Loader2 size={18} className="animate-spin" />}
                {sending ? '...' : t('checkout.placeOrder')}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white dark:bg-stone-900 rounded-xl shadow-sm p-4 sm:p-8 h-fit sticky top-24">
            <h2 className="font-serif text-2xl text-stone-900 dark:text-white mb-6">
              {t('checkout.orderSummary')}
            </h2>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-contain bg-stone-100 rounded p-1"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-stone-900 dark:text-white">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-stone-500 dark:text-stone-400">
                      {t('cart.quantity')}: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium text-stone-900 dark:text-white">
                    {t('products.currency')}{(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-stone-200 dark:border-stone-700 pt-4 space-y-2">
              <div className="flex justify-between text-stone-600 dark:text-stone-400">
                <span>{t('checkout.items')}</span>
                <span>{t('products.currency')}{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-600 dark:text-stone-400">
                <span>{t('checkout.delivery')}</span>
                <span className="text-green-600">{t('checkout.free')}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-stone-900 dark:text-white pt-2 border-t border-stone-200 dark:border-stone-700">
                <span>{t('cart.total')}</span>
                <span>{t('products.currency')}{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
