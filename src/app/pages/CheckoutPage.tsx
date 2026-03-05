import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { db } from '../../services/database';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Loader2, ArrowLeft, ShoppingBag } from 'lucide-react';
import { NovaPoshtaSelector } from '../components/NovaPoshtaSelector';
import { NovaPoshtaCity, NovaPoshtaWarehouse, NovaPoshtaDeliveryCost } from '../../services/novaPoshta';

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

const europeanCountries = [
  { code: 'UA', nameKey: 'countries.ukraine',       flag: '🇺🇦', phoneCode: '+380' },
  { code: 'PL', nameKey: 'countries.poland',        flag: '🇵🇱', phoneCode: '+48'  },
  { code: 'DE', nameKey: 'countries.germany',       flag: '🇩🇪', phoneCode: '+49'  },
  { code: 'FR', nameKey: 'countries.france',        flag: '🇫🇷', phoneCode: '+33'  },
  { code: 'IT', nameKey: 'countries.italy',         flag: '🇮🇹', phoneCode: '+39'  },
  { code: 'ES', nameKey: 'countries.spain',         flag: '🇪🇸', phoneCode: '+34'  },
  { code: 'GB', nameKey: 'countries.unitedKingdom', flag: '🇬🇧', phoneCode: '+44'  },
  { code: 'NL', nameKey: 'countries.netherlands',   flag: '🇳🇱', phoneCode: '+31'  },
  { code: 'BE', nameKey: 'countries.belgium',       flag: '🇧🇪', phoneCode: '+32'  },
  { code: 'AT', nameKey: 'countries.austria',       flag: '🇦🇹', phoneCode: '+43'  },
  { code: 'CH', nameKey: 'countries.switzerland',   flag: '🇨🇭', phoneCode: '+41'  },
  { code: 'CZ', nameKey: 'countries.czechRepublic', flag: '🇨🇿', phoneCode: '+420' },
  { code: 'RO', nameKey: 'countries.romania',       flag: '🇷🇴', phoneCode: '+40'  },
  { code: 'HU', nameKey: 'countries.hungary',       flag: '🇭🇺', phoneCode: '+36'  },
  { code: 'SK', nameKey: 'countries.slovakia',      flag: '🇸🇰', phoneCode: '+421' },
];

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
    phone:     user?.phone     || '',
    country:   '',
    address:   '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Auto-fill phone prefix when country changes
  const handleCountryChange = (countryCode: string) => {
    const country = europeanCountries.find(c => c.code === countryCode);
    setFormData(prev => ({
      ...prev,
      country: countryCode,
      phone: country ? country.phoneCode + ' ' : '',
    }));
  };

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
    if (!formData.country)        newErrors.country  = t('checkout.selectCountry');
    if (!formData.address.trim()) newErrors.address  = t('checkout.required');

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
      const countryLabel = europeanCountries.find(c => c.code === formData.country)?.flag + ' ' + formData.country;
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
      };

      // Save order to local DB (guest userId = 'guest')
      db.createOrder({
        userId: user?.id ?? 'guest',
        items,
        total,
        customerInfo: {
          firstName: safe.firstName,
          lastName:  safe.lastName,
          email:     safe.email,
          phone:     safe.phone,
          country:   safe.country,
          address:   safe.address,
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
          customer_address: safe.address,
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
      <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <CheckCircle size={64} className="text-green-600 mx-auto mb-4" />
          <h2 className="font-serif text-3xl text-stone-900 mb-2">
            {t('common.success')}!
          </h2>
          <p className="text-stone-600 mb-6">
            {t('checkout.orderSuccess')}
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-stone-900 text-white hover:bg-stone-800 transition-colors"
          >
            {t('cart.continueShopping')}
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center px-4">
        <div className="text-center">
          <ShoppingBag size={64} className="text-stone-300 mx-auto mb-4" />
          <h2 className="font-serif text-3xl text-stone-900 mb-4">
            {t('cart.empty')}
          </h2>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-stone-900 text-white hover:bg-stone-800 transition-colors rounded-lg"
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
          <div className="bg-white dark:bg-stone-900 rounded-lg shadow-sm p-8">
            <h2 className="font-serif text-2xl text-stone-900 dark:text-white mb-6">
              {t('checkout.personalInfo')}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                    {t('checkout.firstName')} *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className={`w-full px-4 py-3 border ${errors.firstName ? 'border-red-500' : 'border-stone-300 dark:border-stone-600'} rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-white placeholder-stone-400 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none`}
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
                    className={`w-full px-4 py-3 border ${errors.lastName ? 'border-red-500' : 'border-stone-300 dark:border-stone-600'} rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-white placeholder-stone-400 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none`}
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
                  className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-stone-300 dark:border-stone-600'} rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-white placeholder-stone-400 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                  {t('checkout.country')} *
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className={`w-full px-4 py-3 border ${errors.country ? 'border-red-500' : 'border-stone-300 dark:border-stone-600'} rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none`}
                >
                  <option value="">{t('checkout.selectCountry')}</option>
                  {europeanCountries.map(country => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {t(country.nameKey)}
                    </option>
                  ))}
                </select>
                {errors.country && (
                  <p className="text-red-500 text-sm mt-1">{errors.country}</p>
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
                  className={`w-full px-4 py-3 border ${errors.phone ? 'border-red-500' : 'border-stone-300 dark:border-stone-600'} rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-white placeholder-stone-400 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                  {t('checkout.address')} *
                </label>
                <textarea
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder={t('checkout.addressPlaceholder')}
                  className={`w-full px-4 py-3 border ${errors.address ? 'border-red-500' : 'border-stone-300 dark:border-stone-600'} rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-white placeholder-stone-400 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none resize-none`}
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full py-4 bg-stone-900 text-white font-medium hover:bg-stone-800 transition-colors rounded-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {sending && <Loader2 size={18} className="animate-spin" />}
                {sending ? '...' : t('checkout.placeOrder')}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white dark:bg-stone-900 rounded-lg shadow-sm p-8 h-fit sticky top-24">
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
