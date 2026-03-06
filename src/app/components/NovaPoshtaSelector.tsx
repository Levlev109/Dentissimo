import { useState, useEffect } from 'react';
import { Search, MapPin, Package, Box, Loader2, TruckIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { 
  novaPoshtaService, 
  NovaPoshtaCity, 
  NovaPoshtaWarehouse,
  NovaPoshtaDeliveryCost 
} from '../../services/novaPoshta';

interface NovaPoshtaSelectorProps {
  onSelect: (data: {
    city: NovaPoshtaCity;
    warehouse: NovaPoshtaWarehouse;
    cost: NovaPoshtaDeliveryCost;
  }) => void;
  cartTotal: number;
}

export const NovaPoshtaSelector = ({ onSelect, cartTotal }: NovaPoshtaSelectorProps) => {
  const { t } = useTranslation();
  
  // State
  const [deliveryType, setDeliveryType] = useState<'branch' | 'locker' | 'courier'>('branch');
  const [citySearch, setCitySearch] = useState('');
  const [cities, setCities] = useState<NovaPoshtaCity[]>([]);
  const [selectedCity, setSelectedCity] = useState<NovaPoshtaCity | null>(null);
  const [warehouses, setWarehouses] = useState<NovaPoshtaWarehouse[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<NovaPoshtaWarehouse | null>(null);
  const [deliveryCost, setDeliveryCost] = useState<NovaPoshtaDeliveryCost | null>(null);
  
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingWarehouses, setLoadingWarehouses] = useState(false);
  const [loadingCost, setLoadingCost] = useState(false);
  const [cityFocused, setCityFocused] = useState(false);

  // Load popular cities on mount
  useEffect(() => {
    loadPopularCities();
  }, []);

  const loadPopularCities = async () => {
    setLoadingCities(true);
    try {
      const popularCities = await novaPoshtaService.getPopularCities();
      setCities(popularCities);
    } catch (error) {
      console.error('Failed to load cities:', error);
    } finally {
      setLoadingCities(false);
    }
  };

  // Search cities
  useEffect(() => {
    if (citySearch.length < 2) {
      loadPopularCities();
      return;
    }

    const timer = setTimeout(async () => {
      setLoadingCities(true);
      try {
        const results = await novaPoshtaService.searchCities(citySearch);
        setCities(results);
      } catch (error) {
        console.error('Failed to search cities:', error);
      } finally {
        setLoadingCities(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [citySearch]);

  // Load warehouses when city is selected
  useEffect(() => {
    if (!selectedCity) {
      setWarehouses([]);
      setSelectedWarehouse(null);
      return;
    }

    if (deliveryType === 'courier') {
      // For courier delivery, no warehouse selection needed
      calculateCourierCost();
      return;
    }

    loadWarehouses();
  }, [selectedCity, deliveryType]);

  const loadWarehouses = async () => {
    if (!selectedCity) return;
    
    setLoadingWarehouses(true);
    try {
      const type = deliveryType === 'locker' ? 'locker' : 'branch';
      const result = await novaPoshtaService.getWarehouses(selectedCity.ref, type);
      setWarehouses(result);
    } catch (error) {
      console.error('Failed to load warehouses:', error);
    } finally {
      setLoadingWarehouses(false);
    }
  };

  // Calculate delivery cost when warehouse is selected
  useEffect(() => {
    if (!selectedCity || !selectedWarehouse) {
      setDeliveryCost(null);
      return;
    }

    calculateDeliveryCost();
  }, [selectedWarehouse]);

  const calculateDeliveryCost = async () => {
    if (!selectedCity || !selectedWarehouse) return;

    setLoadingCost(true);
    try {
      // Estimate weight: assume 1 item = 0.15 kg average
      const estimatedWeight = 0.5; // Base package weight
      
      const cost = await novaPoshtaService.calculateCost(
        selectedCity.ref,
        selectedWarehouse.ref,
        estimatedWeight,
        cartTotal
      );
      
      setDeliveryCost(cost);
      
      // Notify parent component
      onSelect({
        city: selectedCity,
        warehouse: selectedWarehouse,
        cost,
      });
    } catch (error) {
      console.error('Failed to calculate cost:', error);
    } finally {
      setLoadingCost(false);
    }
  };

  const calculateCourierCost = async () => {
    if (!selectedCity) return;

    setLoadingCost(true);
    try {
      const cost: NovaPoshtaDeliveryCost = {
        cost: 95, // Courier base cost
        estimatedDays: selectedCity.ref.includes('kyiv') ? '1-2 дні' : '2-4 дні',
      };
      
      setDeliveryCost(cost);
      
      // Create mock warehouse for courier
      const mockWarehouse: NovaPoshtaWarehouse = {
        ref: 'courier-' + selectedCity.ref,
        description: t('novaPoshta.courierDelivery'),
        number: 'COURIER',
        cityRef: selectedCity.ref,
        typeOfWarehouse: 'courier',
      };
      
      onSelect({
        city: selectedCity,
        warehouse: mockWarehouse,
        cost,
      });
    } finally {
      setLoadingCost(false);
    }
  };

  const handleCitySelect = (city: NovaPoshtaCity) => {
    setSelectedCity(city);
    setCitySearch(city.description);
    setCityFocused(false);
    setSelectedWarehouse(null);
    setDeliveryCost(null);
  };

  const handleWarehouseSelect = (warehouse: NovaPoshtaWarehouse) => {
    setSelectedWarehouse(warehouse);
  };

  return (
    <div className="space-y-6">
      {/* Delivery Type Selection */}
      <div>
        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-3">
          {t('novaPoshta.deliveryType')} *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setDeliveryType('branch')}
            className={`p-4 border-2 rounded-xl transition-all ${
              deliveryType === 'branch'
                ? 'border-stone-900 bg-stone-50'
                : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-500'
            }`}
          >
            <Package className={`mx-auto sm:mx-auto mb-2 ${deliveryType === 'branch' ? 'text-stone-900 dark:text-white' : 'text-stone-400'}`} size={24} />
            <div className="text-sm font-medium text-stone-900 dark:text-white">{t('novaPoshta.branch')}</div>
            <div className="text-xs text-stone-500 mt-1">{t('novaPoshta.branchDesc')}</div>
          </button>

          <button
            type="button"
            onClick={() => setDeliveryType('locker')}
            className={`p-4 border-2 rounded-xl transition-all ${
              deliveryType === 'locker'
                ? 'border-stone-900 bg-stone-50'
                : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-500'
            }`}
          >
            <Box className={`mx-auto sm:mx-auto mb-2 ${deliveryType === 'locker' ? 'text-stone-900 dark:text-white' : 'text-stone-400'}`} size={24} />
            <div className="text-sm font-medium text-stone-900 dark:text-white">{t('novaPoshta.locker')}</div>
            <div className="text-xs text-stone-500 mt-1">{t('novaPoshta.lockerDesc')}</div>
          </button>

          <button
            type="button"
            onClick={() => setDeliveryType('courier')}
            className={`p-4 border-2 rounded-xl transition-all ${
              deliveryType === 'courier'
                ? 'border-stone-900 bg-stone-50'
                : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-500'
            }`}
          >
            <TruckIcon className={`mx-auto sm:mx-auto mb-2 ${deliveryType === 'courier' ? 'text-stone-900 dark:text-white' : 'text-stone-400'}`} size={24} />
            <div className="text-sm font-medium text-stone-900 dark:text-white">{t('novaPoshta.courier')}</div>
            <div className="text-xs text-stone-500 mt-1">{t('novaPoshta.courierDesc')}</div>
          </button>
        </div>
      </div>

      {/* City Search */}
      <div>
        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
          {t('novaPoshta.city')} *
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input
            type="text"
            value={citySearch}
            onChange={(e) => {
              setCitySearch(e.target.value);
              setCityFocused(true);
              if (selectedCity && e.target.value !== selectedCity.description) {
                setSelectedCity(null);
              }
            }}
            onFocus={() => setCityFocused(true)}
            onBlur={() => setTimeout(() => setCityFocused(false), 200)}
            placeholder={t('novaPoshta.cityPlaceholder')}
            className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-lg bg-white text-stone-900 placeholder-stone-400 focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none"
          />
        </div>

        {/* Cities Dropdown */}
        {cityFocused && cities.length > 0 && (
          <div className="mt-2 max-h-60 overflow-y-auto border border-stone-200 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800 shadow-lg">
            {loadingCities ? (
              <div className="p-4 text-center text-stone-500">
                <Loader2 className="animate-spin mx-auto mb-2" size={20} />
                {t('common.loading')}...
              </div>
            ) : (
              cities.map((city) => (
                <button
                  key={city.ref}
                  type="button"
                  onClick={() => handleCitySelect(city)}
                  className="w-full px-4 py-3 text-left hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors border-b border-stone-100 dark:border-stone-700 last:border-0"
                >
                  <div className="flex items-start gap-2">
                    <MapPin className="text-stone-400 flex-shrink-0 mt-0.5" size={16} />
                    <div>
                      <div className="font-medium text-stone-900 dark:text-white">{city.description}</div>
                      <div className="text-xs text-stone-500 dark:text-stone-400">{city.area}</div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Courier Address Input (only for courier delivery) */}
      {selectedCity && deliveryType === 'courier' && (
        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
            {t('novaPoshta.courierAddress')} *
          </label>
          <input
            type="text"
            placeholder={t('novaPoshta.courierAddressPlaceholder')}
            className="w-full px-4 py-3 border border-stone-300 rounded-lg bg-white text-stone-900 placeholder-stone-400 focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none"
          />
        </div>
      )}

      {/* Warehouse Selection (for branch/locker) */}
      {selectedCity && deliveryType !== 'courier' && warehouses.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
            {deliveryType === 'locker' ? t('novaPoshta.selectLocker') : t('novaPoshta.selectBranch')} *
          </label>
          
          {loadingWarehouses ? (
              <div className="p-4 text-center text-stone-500 dark:text-stone-400 border border-stone-200 dark:border-stone-700 rounded-lg">
              <Loader2 className="animate-spin mx-auto mb-2" size={20} />
              {t('common.loading')}...
            </div>
          ) : (
            <div className="max-h-60 overflow-y-auto border border-stone-200 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800">
              {warehouses.map((warehouse) => (
                <button
                  key={warehouse.ref}
                  type="button"
                  onClick={() => handleWarehouseSelect(warehouse)}
                  className={`w-full px-4 py-3 text-left transition-all border-b border-stone-100 dark:border-stone-700 last:border-0 ${
                    selectedWarehouse?.ref === warehouse.ref
                      ? 'bg-sky-50 border-l-4 border-l-sky-400'
                      : 'hover:bg-stone-50 dark:hover:bg-stone-700'
                  }`}
                >
                  <div className="font-medium text-stone-900 dark:text-white">{warehouse.description}</div>
                  <div className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    {deliveryType === 'locker' ? t('novaPoshta.locker') : t('novaPoshta.branch')} №{warehouse.number}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Delivery Cost Summary */}
      {deliveryCost && (
        <div className="bg-sky-50 border-l-4 border-sky-400 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <TruckIcon className="text-stone-700 dark:text-stone-300 flex-shrink-0" size={20} />
            <div className="flex-1">
              <div className="font-semibold text-stone-900 dark:text-white mb-1">
                {t('novaPoshta.deliveryCost')}
              </div>
              <div className="text-2xl font-bold text-stone-900 dark:text-white mb-1">
                {deliveryCost.cost} ₴
              </div>
              <div className="text-sm text-stone-600 dark:text-stone-300">
                {t('novaPoshta.estimatedDelivery')}: {deliveryCost.estimatedDays}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
