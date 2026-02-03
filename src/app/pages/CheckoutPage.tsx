import { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { db } from '../../services/database';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const europeanCountries = [
  { code: 'UA', nameKey: 'countries.ukraine', flag: '🇺🇦', phoneCode: '+380' },
  { code: 'PL', nameKey: 'countries.poland', flag: '🇵🇱', phoneCode: '+48' },
  { code: 'DE', nameKey: 'countries.germany', flag: '🇩🇪', phoneCode: '+49' },
  { code: 'FR', nameKey: 'countries.france', flag: '🇫🇷', phoneCode: '+33' },
  { code: 'IT', nameKey: 'countries.italy', flag: '🇮🇹', phoneCode: '+39' },
  { code: 'ES', nameKey: 'countries.spain', flag: '🇪🇸', phoneCode: '+34' },
  { code: 'GB', nameKey: 'countries.unitedKingdom', flag: '🇬🇧', phoneCode: '+44' },
  { code: 'NL', nameKey: 'countries.netherlands', flag: '🇳🇱', phoneCode: '+31' },
  { code: 'BE', nameKey: 'countries.belgium', flag: '🇧🇪', phoneCode: '+32' },
  { code: 'AT', nameKey: 'countries.austria', flag: '🇦🇹', phoneCode: '+43' },
  { code: 'CH', nameKey: 'countries.switzerland', flag: '🇨🇭', phoneCode: '+41' },
  { code: 'CZ', nameKey: 'countries.czechRepublic', flag: '🇨🇿', phoneCode: '+420' },
  { code: 'RO', nameKey: 'countries.romania', flag: '🇷🇴', phoneCode: '+40' },
  { code: 'HU', nameKey: 'countries.hungary', flag: '🇭🇺', phoneCode: '+36' },
  { code: 'SK', nameKey: 'countries.slovakia', flag: '🇸🇰', phoneCode: '+421' },
];

export const CheckoutPage = () => {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [orderPlaced, setOrderPlaced] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    country: '',
    address: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validatePhone = (phone: string, country: string): boolean => {
    const selectedCountry = europeanCountries.find(c => c.code === country);
    if (!selectedCountry) return false;
    
    // Simple validation - phone should start with country code
    return phone.startsWith(selectedCountry.phoneCode);
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName) newErrors.firstName = t('checkout.required');
    if (!formData.lastName) newErrors.lastName = t('checkout.required');
    if (!formData.phone) {
      newErrors.phone = t('checkout.required');
    } else if (!validatePhone(formData.phone, formData.country)) {
      newErrors.phone = t('checkout.invalidPhone');
    }
    if (!formData.country) newErrors.country = t('checkout.selectCountry');
    if (!formData.address) newErrors.address = t('checkout.required');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!user) return;

    // Create order
    db.createOrder({
      userId: user.id,
      items,
      total,
      customerInfo: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        country: formData.country,
        address: formData.address
      },
      status: 'pending'
    });

    // Clear cart and show success
    clearCart();
    setOrderPlaced(true);
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
          <h2 className="font-serif text-3xl text-stone-900 mb-4">
            {t('cart.empty')}
          </h2>
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

  return (
    <div className="min-h-screen bg-[#F9F8F6] pt-32 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-serif text-4xl text-stone-900 mb-8">
          {t('checkout.title')}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="font-serif text-2xl text-stone-900 mb-6">
              {t('checkout.personalInfo')}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    {t('checkout.firstName')} *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className={`w-full px-4 py-3 border ${errors.firstName ? 'border-red-500' : 'border-stone-300'} rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none`}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    {t('checkout.lastName')} *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className={`w-full px-4 py-3 border ${errors.lastName ? 'border-red-500' : 'border-stone-300'} rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none`}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  {t('checkout.country')} *
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value, phone: '' })}
                  className={`w-full px-4 py-3 border ${errors.country ? 'border-red-500' : 'border-stone-300'} rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none`}
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
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  {t('checkout.phone')} *
                </label>
                <div className="flex gap-2">
                  {formData.country && (
                    <span className="px-4 py-3 bg-stone-100 border border-stone-300 rounded-lg text-stone-700">
                      {europeanCountries.find(c => c.code === formData.country)?.phoneCode}
                    </span>
                  )}
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder={t('checkout.phonePlaceholder')}
                    className={`flex-1 px-4 py-3 border ${errors.phone ? 'border-red-500' : 'border-stone-300'} rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  {t('checkout.address')} *
                </label>
                <textarea
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder={t('checkout.addressPlaceholder')}
                  className={`w-full px-4 py-3 border ${errors.address ? 'border-red-500' : 'border-stone-300'} rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none resize-none`}
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-stone-900 text-white font-medium hover:bg-stone-800 transition-colors rounded-lg"
              >
                {t('checkout.placeOrder')}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-8 h-fit sticky top-24">
            <h2 className="font-serif text-2xl text-stone-900 mb-6">
              {t('checkout.orderSummary')}
            </h2>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-stone-900">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-stone-500">
                      {t('cart.quantity')}: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium text-stone-900">
                    {t('products.currency')}{(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-stone-200 pt-4 space-y-2">
              <div className="flex justify-between text-stone-600">
                <span>{t('checkout.items')}</span>
                <span>{t('products.currency')}{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>{t('checkout.delivery')}</span>
                <span className="text-green-600">{t('checkout.free')}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-stone-900 pt-2 border-t border-stone-200">
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
