// Nova Poshta delivery service — real API integration
// Docs: https://developers.novaposhta.ua/
// API Key: https://my.novaposhta.ua/settings/api

const API_URL = 'https://api.novaposhta.ua/v2.0/json/';
const API_KEY = import.meta.env.VITE_NOVA_POSHTA_API_KEY || '';

// Nova Poshta warehouse type refs
const POSTOMAT_TYPE_REF = 'f9316480-5f2d-425d-bc2c-ac7cd29decf0';

export interface NovaPoshtaCity {
  ref: string;          // DeliveryCity ref (used for warehouse lookups)
  settlementRef: string; // Settlement ref
  description: string;  // City/town/village name
  area: string;         // Oblast
  region: string;       // Raion
  settlementType: string;
}

export interface NovaPoshtaWarehouse {
  ref: string;
  description: string;
  shortAddress: string;
  number: string;
  cityRef: string;
  typeOfWarehouse: string; // 'branch' | 'locker'
}

export interface NovaPoshtaDeliveryCost {
  cost: number;
  estimatedDays: string;
}

async function apiRequest(model: string, method: string, properties: Record<string, unknown>) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      apiKey: API_KEY,
      modelName: model,
      calledMethod: method,
      methodProperties: properties,
    }),
  });

  if (!response.ok) {
    throw new Error(`Nova Poshta API HTTP ${response.status}`);
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.errors?.[0] || 'Nova Poshta API error');
  }
  return data;
}

class NovaPoshtaService {
  /**
   * Search cities / towns / villages by name (real API)
   */
  async searchCities(query: string): Promise<NovaPoshtaCity[]> {
    if (!query || query.length < 2) return [];

    const result = await apiRequest('Address', 'searchSettlements', {
      CityName: query,
      Limit: '20',
      Page: '1',
    });

    const addresses = result.data?.[0]?.Addresses;
    if (!Array.isArray(addresses)) return [];

    return addresses.map((a: Record<string, string>) => ({
      ref: a.DeliveryCity,
      settlementRef: a.Ref,
      description: a.MainDescription,
      area: a.Area,
      region: a.Region || '',
      settlementType: a.SettlementTypeDescription || '',
    }));
  }

  /**
   * Get warehouses / postomats for a city (real API)
   */
  async getWarehouses(
    cityRef: string,
    type?: 'branch' | 'locker',
    searchQuery?: string,
    page = 1,
    limit = 50,
  ): Promise<NovaPoshtaWarehouse[]> {
    const properties: Record<string, unknown> = {
      CityRef: cityRef,
      Limit: String(limit),
      Page: String(page),
    };

    if (type === 'locker') {
      properties.TypeOfWarehouseRef = POSTOMAT_TYPE_REF;
    } else if (type === 'branch') {
      // Exclude postomats — fetch all then filter client-side
    }

    if (searchQuery) {
      properties.FindByString = searchQuery;
    }

    const result = await apiRequest('Address', 'getWarehouses', properties);

    const warehouses: NovaPoshtaWarehouse[] = (result.data || []).map(
      (w: Record<string, string>) => ({
        ref: w.Ref,
        description: w.Description,
        shortAddress: w.ShortAddress || w.Description,
        number: w.Number,
        cityRef: w.CityRef,
        typeOfWarehouse: w.CategoryOfWarehouse === 'Postomat' ? 'locker' : 'branch',
      }),
    );

    // If requesting branches only, filter out postomats on client side
    if (type === 'branch') {
      return warehouses.filter((w) => w.typeOfWarehouse === 'branch');
    }

    return warehouses;
  }

  /**
   * Estimate delivery cost via InternetDocument/getDocumentPrice
   */
  async calculateCost(
    citySenderRef: string,
    cityRecipientRef: string,
    weight: number,
    cost: number,
  ): Promise<NovaPoshtaDeliveryCost> {
    try {
      const result = await apiRequest('InternetDocument', 'getDocumentPrice', {
        CitySender: citySenderRef,
        CityRecipient: cityRecipientRef,
        Weight: String(weight),
        ServiceType: 'WarehouseWarehouse',
        Cost: String(cost),
        CargoType: 'Parcel',
        SeatsAmount: '1',
      });

      const info = result.data?.[0];
      if (info) {
        return {
          cost: Math.ceil(Number(info.Cost) || 0),
          estimatedDays: `${info.EstimatedDeliveryDateSat || info.DeliveryDate?.day || '2-4'}`,
        };
      }
    } catch {
      // Fallback to static estimate if API fails
    }

    // Fallback estimate
    return { cost: 70, estimatedDays: '2-4' };
  }
}

export const novaPoshtaService = new NovaPoshtaService();
