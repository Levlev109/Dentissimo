// Nova Poshta delivery service
// For production: integrate with real Nova Poshta API (https://developers.novaposhta.ua/)
// API Key needed: https://my.novaposhta.ua/settings/api

export interface NovaPoshtaCity {
  ref: string;
  description: string;
  area: string;
}

export interface NovaPoshtaWarehouse {
  ref: string;
  description: string;
  number: string;
  cityRef: string;
  typeOfWarehouse: string;
  postalCodeUA?: string;
}

export interface NovaPoshtaDeliveryCost {
  cost: number;
  estimatedDays: string;
}

// Mock cities data (popular Ukrainian cities)
const mockCities: NovaPoshtaCity[] = [
  { ref: 'kyiv-1', description: 'Київ', area: 'Київська область' },
  { ref: 'lviv-1', description: 'Львів', area: 'Львівська область' },
  { ref: 'odesa-1', description: 'Одеса', area: 'Одеська область' },
  { ref: 'dnipro-1', description: 'Дніпро', area: 'Дніпропетровська область' },
  { ref: 'kharkiv-1', description: 'Харків', area: 'Харківська область' },
  { ref: 'zaporizhia-1', description: 'Запоріжжя', area: 'Запорізька область' },
  { ref: 'kryvyi-rih-1', description: 'Кривий Ріг', area: 'Дніпропетровська область' },
  { ref: 'mykolaiv-1', description: 'Миколаїв', area: 'Миколаївська область' },
  { ref: 'vinnytsia-1', description: 'Вінниця', area: 'Вінницька область' },
  { ref: 'kherson-1', description: 'Херсон', area: 'Херсонська область' },
  { ref: 'poltava-1', description: 'Полтава', area: 'Полтавська область' },
  { ref: 'chernihiv-1', description: 'Чернігів', area: 'Чернігівська область' },
  { ref: 'cherkasy-1', description: 'Черкаси', area: 'Черкаська область' },
  { ref: 'sumy-1', description: 'Суми', area: 'Сумська область' },
  { ref: 'zhytomyr-1', description: 'Житомир', area: 'Житомирська область' },
  { ref: 'rivne-1', description: 'Рівне', area: 'Рівненська область' },
  { ref: 'ivano-frankivsk-1', description: 'Івано-Франківськ', area: 'Івано-Франківська область' },
  { ref: 'ternopil-1', description: 'Тернопіль', area: 'Тернопільська область' },
  { ref: 'lutsk-1', description: 'Луцьк', area: 'Волинська область' },
  { ref: 'uzhhorod-1', description: 'Ужгород', area: 'Закарпатська область' },
];

// Mock warehouses for each city
const generateWarehouses = (cityRef: string, cityName: string): NovaPoshtaWarehouse[] => {
  const warehouses: NovaPoshtaWarehouse[] = [];
  
  // Generate 5 regular branches
  for (let i = 1; i <= 5; i++) {
    warehouses.push({
      ref: `${cityRef}-branch-${i}`,
      description: `Відділення №${i}: вул. ${getStreetName(i)}, ${cityName}`,
      number: `${i}`,
      cityRef,
      typeOfWarehouse: 'branch',
    });
  }
  
  // Generate 3 parcel lockers
  for (let i = 1; i <= 3; i++) {
    warehouses.push({
      ref: `${cityRef}-locker-${i}`,
      description: `Поштомат №${i}: ${getLockerLocation(i)}, ${cityName}`,
      number: `P${i}`,
      cityRef,
      typeOfWarehouse: 'locker',
    });
  }
  
  return warehouses;
};

const getStreetName = (num: number): string => {
  const streets = [
    'Хрещатик, 1',
    'Шевченка, 45',
    'Грушевського, 12',
    'Лесі Українки, 28',
    'Бандери, 67',
  ];
  return streets[num - 1] || `Центральна, ${num}`;
};

const getLockerLocation = (num: number): string => {
  const locations = [
    'ТРЦ "Глобус"',
    'Супермаркет "Сільпо"',
    'Метро "Центральна"',
  ];
  return locations[num - 1] || 'Центр міста';
};

class NovaPoshtaService {
  private apiKey: string;
  
  constructor(apiKey: string = '') {
    this.apiKey = apiKey;
  }

  /**
   * Search cities by name
   */
  async searchCities(query: string): Promise<NovaPoshtaCity[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!query || query.length < 2) return mockCities.slice(0, 10);
    
    const normalized = query.toLowerCase().trim();
    return mockCities.filter(city => 
      city.description.toLowerCase().includes(normalized)
    );
  }

  /**
   * Get all warehouses for a city
   */
  async getWarehouses(cityRef: string, type?: 'branch' | 'locker'): Promise<NovaPoshtaWarehouse[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const city = mockCities.find(c => c.ref === cityRef);
    if (!city) return [];
    
    const warehouses = generateWarehouses(cityRef, city.description);
    
    if (type) {
      return warehouses.filter(w => w.typeOfWarehouse === type);
    }
    
    return warehouses;
  }

  /**
   * Calculate delivery cost
   */
  async calculateCost(
    cityRef: string,
    warehouseRef: string,
    weight: number, // kg
    cost: number // product cost in UAH
  ): Promise<NovaPoshtaDeliveryCost> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Nova Poshta pricing simulation
    // Branch: 65 UAH base + 10 UAH per kg
    // Locker: 45 UAH base + 8 UAH per kg
    
    const isLocker = warehouseRef.includes('locker');
    const baseCost = isLocker ? 45 : 65;
    const weightCost = (isLocker ? 8 : 10) * Math.ceil(weight);
    
    const deliveryCost = baseCost + weightCost;
    
    // Estimated delivery time
    const isCapital = cityRef.includes('kyiv');
    const estimatedDays = isCapital ? '1-2 дні' : '2-4 дні';
    
    return {
      cost: deliveryCost,
      estimatedDays,
    };
  }

  /**
   * Get popular cities
   */
  async getPopularCities(): Promise<NovaPoshtaCity[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockCities.slice(0, 10);
  }
}

// Export singleton instance
export const novaPoshtaService = new NovaPoshtaService();
