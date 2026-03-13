import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../../services/currency';
import { orderService } from '../../services/orderService';
import { openPayment } from '../../services/wayforpay';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Loader2, ArrowLeft, ShoppingBag, CreditCard, AlertTriangle } from 'lucide-react';
import { NovaPoshtaSelector } from '../components/NovaPoshtaSelector';
import type { NovaPoshtaCity, NovaPoshtaWarehouse } from '../../services/novaPoshta';

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
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [sending, setSending] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Nova Poshta delivery state
  const [deliveryData, setDeliveryData] = useState<{
    city: NovaPoshtaCity;
    warehouse: NovaPoshtaWarehouse;
    deliveryType: string;
    deliveryCost: number;
    courierAddress?: string;
  } | null>(null);

  const deliveryCost = deliveryData?.deliveryCost ?? 0;
  const grandTotal = total + deliveryCost;

  // Handle return from WayForPay after payment
  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    if (paymentStatus === 'success') {
      clearCart();
      setOrderPlaced(true);

      // Send email notification if pending
      const pendingRaw = localStorage.getItem('dentissimo_pending_email');
      if (pendingRaw) {
        try {
          const pending = JSON.parse(pendingRaw);
          emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            {
              order_id:         pending.orderId,
              customer_name:    pending.customerName,
              customer_email:   pending.customerEmail,
              customer_phone:   pending.customerPhone,
              customer_country: pending.customerCountry,
              customer_address: pending.customerAddress,
              order_items:      pending.orderItems,
              order_total:      pending.orderTotal,
              to_email:         OWNER_EMAIL,
            },
            EMAILJS_PUBLIC_KEY
          ).finally(() => {
            localStorage.removeItem('dentissimo_pending_email');
          });
        } catch {
          localStorage.removeItem('dentissimo_pending_email');
        }
      }
    }
  }, [searchParams, clearCart]);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName:  user?.lastName  || '',
    email:     user?.email     || '',
    phone:     user?.phone     || '+380 ',
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
    if (!formData.phone.trim() || !/^\+?[\d\s\-()]{10,}$/.test(formData.phone.trim()))
      newErrors.phone = t('checkout.required');

    if (!deliveryData) {
      newErrors.delivery = t('checkout.selectDelivery');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSending(true);
    setPaymentError(null);
    try {
      // Sanitize inputs before storage
      const safe = {
        firstName: sanitize(formData.firstName, 50),
        lastName:  sanitize(formData.lastName, 50),
        email:     sanitize(formData.email, 100),
        phone:     sanitize(formData.phone, 30),
      };

      // Build delivery address string
      const deliveryAddress = deliveryData
        ? deliveryData.deliveryType === 'courier'
          ? `${deliveryData.city.description}, ${deliveryData.courierAddress || ''}`
          : `${deliveryData.city.description}, ${deliveryData.warehouse.description}`
        : '';

      // Save order to Supabase (+ localStorage fallback) with pending status
      const order = await orderService.createOrder({
        userId: user?.id ?? 'guest',
        items,
        total: grandTotal,
        customerInfo: {
          firstName: safe.firstName,
          lastName:  safe.lastName,
          email:     safe.email,
          phone:     safe.phone,
          country:   'UA',
          address:   sanitize(deliveryAddress, 300),
        },
        status: 'pending',
      });
      const orderId = order.id;

      // Save order info for email after return from WayForPay
      const countryLabel = `\uD83C\uDDFA\uD83C\uDDE6 ${t('countries.ukraine')}`;
      const itemsText = items
        .map(i => `${i.product.name} × ${i.quantity} = ${t('products.currency')}${formatPrice(i.product.price * i.quantity, i18n.language)}`)
        .join('\n');
      localStorage.setItem('dentissimo_pending_email', JSON.stringify({
        orderId,
        customerName: `${safe.firstName} ${safe.lastName}`,
        customerEmail: safe.email,
        customerPhone: safe.phone,
        customerCountry: countryLabel,
        customerAddress: sanitize(deliveryAddress, 300),
        orderItems: itemsText,
        deliveryCost: `${t('products.currency')}${deliveryCost}`,
        orderTotal: `${t('products.currency')}${formatPrice(grandTotal, i18n.language)}`,
      }));

      // Redirect to WayForPay payment page
      await openPayment({
        orderId,
        amount: grandTotal,
        items: items.map(i => ({
          name: i.product.name,
          price: i.product.price,
          count: i.quantity,
        })),
        clientName: `${safe.firstName} ${safe.lastName}`,
        clientEmail: safe.email,
        clientPhone: safe.phone,
      });
      // Page will redirect — code below only runs if redirect fails
    } catch (err) {
      setPaymentError(err instanceof Error ? err.message : t('checkout.paymentError'));
      setSending(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-stone-900 shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="font-serif text-3xl text-white mb-2">
            {t('common.success')}!
          </h2>
          <p className="text-stone-400 mb-8">
            {t('checkout.orderSuccess')}
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3.5 bg-stone-900 text-white font-semibold hover:bg-stone-800 transition-all shadow-lg"
          >
            {t('cart.continueShopping')}
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center px-4">
        <div className="text-center">
          <ShoppingBag size={64} className="text-stone-600 mx-auto mb-4" />
          <h2 className="font-serif text-3xl text-white mb-4">
            {t('cart.empty')}
          </h2>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3.5 bg-stone-900 text-white font-semibold hover:bg-stone-800 transition-all shadow-lg"
          >
            {t('cart.continueShopping')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 pt-28 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors mb-6 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          {t('cart.continueShopping')}
        </button>
        <h1 className="font-serif text-4xl text-white mb-8">
          {t('checkout.title')}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-stone-900 shadow-sm p-4 sm:p-8">
            <h2 className="font-serif text-2xl text-white mb-6">
              {t('checkout.personalInfo')}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-300 mb-2">
                    {t('checkout.firstName')} *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className={`w-full px-4 py-3 border ${errors.firstName ? 'border-red-500' : 'border-stone-700'} bg-stone-800 text-white placeholder-stone-500 focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none`}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-300 mb-2">
                    {t('checkout.lastName')} *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className={`w-full px-4 py-3 border ${errors.lastName ? 'border-red-500' : 'border-stone-700'} bg-stone-800 text-white placeholder-stone-500 focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none`}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-2">
                  {t('auth.email')} *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="example@mail.com"
                  className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-stone-700'} bg-stone-800 text-white placeholder-stone-500 focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>




              <div>
                <label className="block text-sm font-medium text-stone-300 mb-2">
                  {t('checkout.phone')} *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder={t('checkout.phonePlaceholder')}
                  className={`w-full px-4 py-3 border ${errors.phone ? 'border-red-500' : 'border-stone-700'} bg-stone-800 text-white placeholder-stone-500 focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Nova Poshta Delivery Selection */}
              <div className="pt-4 border-t border-stone-700">
                <h3 className="font-serif text-xl text-white mb-4">
                  {t('checkout.deliverySection')}
                </h3>
                <NovaPoshtaSelector
                  onSelect={(data) => setDeliveryData(data)}
                />
                {errors.delivery && (
                  <p className="text-red-500 text-sm mt-2">{errors.delivery}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={sending}
                className="group relative w-full py-4 text-white font-semibold tracking-widest uppercase disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-base overflow-hidden bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 shadow-[0_6px_30px_rgba(0,0,0,0.25)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.35)] border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-[1.01]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="relative z-10 flex items-center gap-2">
                  {sending && <Loader2 size={18} className="animate-spin" />}
                  {!sending && <CreditCard size={18} />}
                  {sending ? '...' : t('checkout.payNow')}
                </span>
              </button>

              {paymentError && (
                <div className="flex items-center gap-2 p-3 bg-red-900/30 border border-red-700/50 text-red-400 text-sm">
                  <AlertTriangle size={16} />
                  {paymentError}
                </div>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-stone-900 shadow-sm p-4 sm:p-8 h-fit sticky top-24">
            <h2 className="font-serif text-2xl text-white mb-6">
              {t('checkout.orderSummary')}
            </h2>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-contain bg-stone-800 rounded p-1"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-white">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-stone-400">
                      {t('cart.quantity')}: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium text-white">
                    {t('products.currency')}{formatPrice(item.product.price * item.quantity, i18n.language)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-stone-700 pt-4 space-y-2">
              <div className="flex justify-between text-stone-400">
                <span>{t('checkout.items')}</span>
                <span>{t('products.currency')}{formatPrice(total, i18n.language)}</span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>{t('checkout.delivery')}</span>
                {deliveryCost > 0 ? (
                  <span>{t('products.currency')}{deliveryCost}</span>
                ) : (
                  <span className="text-stone-500">—</span>
                )}
              </div>
              <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-stone-700">
                <span>{t('cart.total')}</span>
                <span>{t('products.currency')}{formatPrice(grandTotal, i18n.language)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
