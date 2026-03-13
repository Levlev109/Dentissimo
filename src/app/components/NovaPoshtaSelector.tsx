import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Package, Box, Loader2, TruckIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { 
  novaPoshtaService, 
  NovaPoshtaCity, 
  NovaPoshtaWarehouse,
} from '../../services/novaPoshta';

// Fixed delivery cost tiers (UAH), matching real Nova Poshta pricing
const DELIVERY_PRICES = {
  branch: 70,
  locker: 45,
  courier: 100,
} as const;

interface NovaPoshtaSelectorProps {
  onSelect: (data: {
    city: NovaPoshtaCity;
    warehouse: NovaPoshtaWarehouse;
    deliveryType: string;
    deliveryCost: number;
    courierAddress?: string;
  }) => void;
}

export const NovaPoshtaSelector = ({ onSelect }: NovaPoshtaSelectorProps) => {
  const { t } = useTranslation();
  
  // State
  const [deliveryType, setDeliveryType] = useState<'branch' | 'locker' | 'courier'>('branch');
  const [citySearch, setCitySearch] = useState('');
  const [cities, setCities] = useState<NovaPoshtaCity[]>([]);
  const [selectedCity, setSelectedCity] = useState<NovaPoshtaCity | null>(null);
  const [warehouseSearch, setWarehouseSearch] = useState('');
  const [warehouses, setWarehouses] = useState<NovaPoshtaWarehouse[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<NovaPoshtaWarehouse | null>(null);
  
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingWarehouses, setLoadingWarehouses] = useState(false);
  const [cityFocused, setCityFocused] = useState(false);
  const [courierAddress, setCourierAddress] = useState('');

  const cityDropdownRef = useRef<HTMLDivElement>(null);

  // Search cities with debounce
  useEffect(() => {
    if (citySearch.length < 2) {
      setCities([]);
      return;
    }

    // Don't search if the input matches the already-selected city
    if (selectedCity && citySearch === selectedCity.description) return;

    const timer = setTimeout(async () => {
      setLoadingCities(true);
      try {
        const results = await novaPoshtaService.searchCities(citySearch);
        setCities(results);
      } catch (error) {
        console.error('Failed to search cities:', error);
        setCities([]);
      } finally {
        setLoadingCities(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [citySearch, selectedCity]);

  // Load warehouses when city or deliveryType changes
  useEffect(() => {
    if (!selectedCity || deliveryType === 'courier') {
      setWarehouses([]);
      setSelectedWarehouse(null);
      return;
    }

    loadWarehouses();
  }, [selectedCity, deliveryType]);

  // Search warehouses with debounce
  useEffect(() => {
    if (!selectedCity || deliveryType === 'courier') return;

    const timer = setTimeout(() => {
      loadWarehouses(warehouseSearch || undefined);
    }, 400);

    return () => clearTimeout(timer);
  }, [warehouseSearch]);

  const loadWarehouses = async (search?: string) => {
    if (!selectedCity) return;
    
    setLoadingWarehouses(true);
    try {
      const type = deliveryType === 'locker' ? 'locker' : 'branch';
      const result = await novaPoshtaService.getWarehouses(selectedCity.ref, type, search);
      setWarehouses(result);
    } catch (error) {
      console.error('Failed to load warehouses:', error);
      setWarehouses([]);
    } finally {
      setLoadingWarehouses(false);
    }
  };

  const deliveryCost = DELIVERY_PRICES[deliveryType];

  // Notify parent when warehouse selected
  useEffect(() => {
    if (!selectedCity || !selectedWarehouse) return;
    onSelect({
      city: selectedCity,
      warehouse: selectedWarehouse,
      deliveryType,
      deliveryCost,
    });
  }, [selectedWarehouse]);

  // Notify parent for courier delivery
  useEffect(() => {
    if (!selectedCity || deliveryType !== 'courier' || !courierAddress.trim()) return;

    const debounce = setTimeout(() => {
      const mockWarehouse: NovaPoshtaWarehouse = {
        ref: 'courier-' + selectedCity.ref,
        description: courierAddress,
        shortAddress: courierAddress,
        number: 'COURIER',
        cityRef: selectedCity.ref,
        typeOfWarehouse: 'courier',
      };
      onSelect({
        city: selectedCity,
        warehouse: mockWarehouse,
        deliveryType: 'courier',
        deliveryCost: DELIVERY_PRICES.courier,
        courierAddress,
      });
    }, 300);
    return () => clearTimeout(debounce);
  }, [selectedCity, courierAddress, deliveryType]);

  const handleCitySelect = (city: NovaPoshtaCity) => {
    setSelectedCity(city);
    setCitySearch(city.description);
    setCityFocused(false);
    setSelectedWarehouse(null);
    setWarehouseSearch('');
    setWarehouses([]);
  };

  const handleWarehouseSelect = (warehouse: NovaPoshtaWarehouse) => {
    setSelectedWarehouse(warehouse);
  };

  const handleDeliveryTypeChange = (type: 'branch' | 'locker' | 'courier') => {
    setDeliveryType(type);
    setSelectedWarehouse(null);
    setWarehouseSearch('');
  };

  return (
    <div className="space-y-6">
      {/* Delivery Type Selection */}
      <div>
        <label className="block text-sm font-medium text-stone-300 mb-3">
          {t('novaPoshta.deliveryType')} *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => handleDeliveryTypeChange('branch')}
            className={`p-4 border-2 transition-all ${
              deliveryType === 'branch'
                ? 'border-white bg-stone-800'
                : 'border-stone-700 hover:border-stone-500'
            }`}
          >
            <Package className={`mx-auto mb-2 ${deliveryType === 'branch' ? 'text-white' : 'text-stone-400'}`} size={24} />
            <div className="text-sm font-medium text-white">{t('novaPoshta.branch')}</div>
            <div className="text-xs text-stone-500 mt-1">{t('novaPoshta.branchDesc')}</div>
            <div className="text-xs text-cyan-400 mt-1">{DELIVERY_PRICES.branch} {t('products.currency')}</div>
          </button>

          <button
            type="button"
            onClick={() => handleDeliveryTypeChange('locker')}
            className={`p-4 border-2 transition-all ${
              deliveryType === 'locker'
                ? 'border-white bg-stone-800'
                : 'border-stone-700 hover:border-stone-500'
            }`}
          >
            <Box className={`mx-auto mb-2 ${deliveryType === 'locker' ? 'text-white' : 'text-stone-400'}`} size={24} />
            <div className="text-sm font-medium text-white">{t('novaPoshta.locker')}</div>
            <div className="text-xs text-stone-500 mt-1">{t('novaPoshta.lockerDesc')}</div>
            <div className="text-xs text-cyan-400 mt-1">{DELIVERY_PRICES.locker} {t('products.currency')}</div>
          </button>

          <button
            type="button"
            onClick={() => handleDeliveryTypeChange('courier')}
            className={`p-4 border-2 transition-all ${
              deliveryType === 'courier'
                ? 'border-white bg-stone-800'
                : 'border-stone-700 hover:border-stone-500'
            }`}
          >
            <TruckIcon className={`mx-auto mb-2 ${deliveryType === 'courier' ? 'text-white' : 'text-stone-400'}`} size={24} />
            <div className="text-sm font-medium text-white">{t('novaPoshta.courier')}</div>
            <div className="text-xs text-stone-500 mt-1">{t('novaPoshta.courierDesc')}</div>
            <div className="text-xs text-cyan-400 mt-1">{DELIVERY_PRICES.courier} {t('products.currency')}</div>
          </button>
        </div>
      </div>

      {/* City Search */}
      <div className="relative" ref={cityDropdownRef}>
        <label className="block text-sm font-medium text-stone-300 mb-2">
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
                setSelectedWarehouse(null);
                setWarehouses([]);
              }
            }}
            onFocus={() => setCityFocused(true)}
            onBlur={() => setTimeout(() => setCityFocused(false), 200)}
            placeholder={t('novaPoshta.cityPlaceholder')}
            className="w-full pl-10 pr-4 py-3 border border-stone-700 bg-stone-800 text-white placeholder-stone-500 focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none"
          />
          {loadingCities && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-stone-400" size={18} />
          )}
        </div>

        {/* Cities Dropdown */}
        {cityFocused && cities.length > 0 && (
          <div className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto border border-stone-700 bg-stone-800 shadow-lg">
            {cities.map((city) => (
              <button
                key={city.ref + city.settlementRef}
                type="button"
                onClick={() => handleCitySelect(city)}
                className="w-full px-4 py-3 text-left hover:bg-stone-700 transition-colors border-b border-stone-700 last:border-0"
              >
                <div className="flex items-start gap-2">
                  <MapPin className="text-stone-400 flex-shrink-0 mt-0.5" size={16} />
                  <div>
                    <div className="font-medium text-white">
                      {city.settlementType ? `${city.settlementType} ` : ''}{city.description}
                    </div>
                    <div className="text-xs text-stone-400">
                      {city.area}
                      {city.region ? `, ${city.region}` : ''}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {cityFocused && !loadingCities && citySearch.length >= 2 && cities.length === 0 && (
          <div className="absolute z-50 w-full mt-1 border border-stone-700 bg-stone-800 p-4 text-center text-stone-500">
            {t('novaPoshta.noCitiesFound')}
          </div>
        )}
      </div>

      {/* Courier Address Input */}
      {selectedCity && deliveryType === 'courier' && (
        <div>
          <label className="block text-sm font-medium text-stone-300 mb-2">
            {t('novaPoshta.courierAddress')} *
          </label>
          <input
            type="text"
            value={courierAddress}
            onChange={(e) => setCourierAddress(e.target.value)}
            placeholder={t('novaPoshta.courierAddressPlaceholder')}
            className="w-full px-4 py-3 border border-stone-700 bg-stone-800 text-white placeholder-stone-500 focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none"
          />
        </div>
      )}

      {/* Warehouse Selection (for branch/locker) */}
      {selectedCity && deliveryType !== 'courier' && (
        <div>
          <label className="block text-sm font-medium text-stone-300 mb-2">
            {deliveryType === 'locker' ? t('novaPoshta.selectLocker') : t('novaPoshta.selectBranch')} *
          </label>

          {/* Warehouse search input */}
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input
              type="text"
              value={warehouseSearch}
              onChange={(e) => setWarehouseSearch(e.target.value)}
              placeholder={t('novaPoshta.warehouseSearchPlaceholder')}
              className="w-full pl-10 pr-4 py-3 border border-stone-700 bg-stone-800 text-white placeholder-stone-500 focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none"
            />
            {loadingWarehouses && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-stone-400" size={18} />
            )}
          </div>

          {loadingWarehouses && warehouses.length === 0 ? (
            <div className="p-4 text-center text-stone-400 border border-stone-700">
              <Loader2 className="animate-spin mx-auto mb-2" size={20} />
              {t('common.loading')}...
            </div>
          ) : warehouses.length > 0 ? (
            <div className="max-h-60 overflow-y-auto border border-stone-700 bg-stone-800">
              {warehouses.map((warehouse) => (
                <button
                  key={warehouse.ref}
                  type="button"
                  onClick={() => handleWarehouseSelect(warehouse)}
                  className={`w-full px-4 py-3 text-left transition-all border-b border-stone-700 last:border-0 ${
                    selectedWarehouse?.ref === warehouse.ref
                      ? 'bg-cyan-900/30 border-l-4 border-l-cyan-400'
                      : 'hover:bg-stone-700'
                  }`}
                >
                  <div className="font-medium text-white text-sm">{warehouse.description}</div>
                </button>
              ))}
            </div>
          ) : !loadingWarehouses ? (
            <div className="p-4 text-center text-stone-500 border border-stone-700">
              {t('novaPoshta.noWarehousesFound')}
            </div>
          ) : null}
        </div>
      )}

      {/* Selected warehouse confirmation */}
      {selectedWarehouse && deliveryType !== 'courier' && (
        <div className="bg-cyan-900/20 border-l-4 border-cyan-400 p-4">
          <div className="flex items-start gap-3">
            <TruckIcon className="text-stone-300 flex-shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <div className="font-semibold text-white mb-1">
                {t('novaPoshta.selectedWarehouse')}
              </div>
              <div className="text-sm text-stone-300">
                {selectedWarehouse.description}
              </div>
              <div className="text-xs text-stone-400 mt-1">
                {selectedCity?.description}, {selectedCity?.area}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
