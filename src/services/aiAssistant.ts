// AI Assistant Service with real AI API integration

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

// Configuration for AI APIs
const AI_CONFIG = {
  // FREE Hugging Face API - Get your key at https://huggingface.co/settings/tokens
  huggingface: {
    apiKey: localStorage.getItem('hf_api_key') || '',
    model: 'mistralai/Mistral-7B-Instruct-v0.2',
    endpoint: 'https://api-inference.huggingface.co/models/'
  },
  // FREE Google Gemini API - Get your key at https://makersuite.google.com/app/apikey
  gemini: {
    apiKey: localStorage.getItem('gemini_api_key') || '',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
  }
};

const productKnowledge = {
  whitening: {
    keywords: ['білити', 'відбілювання', 'білі зуби', 'whitening', 'white', 'yellow'],
    recommendation: {
      uk: 'Для відбілювання зубів я рекомендую:\n\n1. **Advanced Whitening Gold** (€219) - найефективніша формула з золотом 24К\n2. **Extra-Whitening Black** (€189) - з натуральним активованим вугіллям\n3. **Pro-Whitening** (€159) - професійне відбілювання\n\nВсі ці пасти безпечні для емалі та дають видимий результат через 1-2 тижні.',
      en: 'For teeth whitening, I recommend:\n\n1. **Advanced Whitening Gold** (€219) - most effective formula with 24K gold\n2. **Extra-Whitening Black** (€189) - with natural activated charcoal\n3. **Pro-Whitening** (€159) - professional whitening\n\nAll these toothpastes are safe for enamel and show visible results in 1-2 weeks.'
    }
  },
  sensitive: {
    keywords: ['чутливі', 'болять', 'біль', 'sensitive', 'pain', 'hurt'],
    recommendation: {
      uk: 'Для чутливих зубів ідеально підходять:\n\n1. **SPA Expert** (€189) - з термальною водою льодовика, ніжно доглядає\n2. **Complete Care** (€159) - комплекс Regera-Pro для захисту\n3. **Diamond** (€199) - алмазна пудра без агресивних компонентів\n\n**Щітка**: Обов\'язково використовуйте Sensitive (€89) з м\'якою щетиною.',
      en: 'For sensitive teeth, perfect choices are:\n\n1. **SPA Expert** (€189) - with glacier thermal water, gentle care\n2. **Complete Care** (€159) - Regera-Pro complex for protection\n3. **Diamond** (€199) - diamond powder without aggressive components\n\n**Brush**: Use Sensitive (€89) with soft bristles.'
    }
  },
  kids: {
    keywords: ['дитина', 'дітям', 'kids', 'children', 'child'],
    recommendation: {
      uk: 'Для дітей у нас є спеціальна серія:\n\n**2-6 років:**\n- Kids 2-6 Years (€139) - смак карамелі\n- Kids Brush 2-6 Years (€69) - м\'яка щітка\n\n**6+ років:**\n- Junior 6+ Years (€139) - яблучний смак\n- Junior Brush 6+ Years (€69)\n\nВсі продукти безпечні, без фтору, з приємним смаком!',
      en: 'For children we have a special series:\n\n**2-6 years:**\n- Kids 2-6 Years (€139) - caramel flavor\n- Kids Brush 2-6 Years (€69) - soft brush\n\n**6+ years:**\n- Junior 6+ Years (€139) - apple flavor\n- Junior Brush 6+ Years (€69)\n\nAll products are safe, fluoride-free, with pleasant taste!'
    }
  },
  gums: {
    keywords: ['ясна', 'кровоточать', 'запалення', 'gums', 'bleeding', 'inflammation'],
    recommendation: {
      uk: 'При проблемах з яснами рекомендую:\n\n1. **Pro Care Teeth & Gums** (€159) - спеціально для ясен\n2. **Perio Care CBD** (€179) - з екстрактом конопель, зменшує запалення\n3. **Ополаскувач для порожнини рота** (€169) - проти кровоточивості\n\n**Щітка**: Parodontal (€99) - спеціальна для пародонтального догляду.',
      en: 'For gum problems, I recommend:\n\n1. **Pro Care Teeth & Gums** (€159) - specially for gums\n2. **Perio Care CBD** (€179) - with hemp extract, reduces inflammation\n3. **Mouthwash** (€169) - against bleeding\n\n**Brush**: Parodontal (€99) - special for periodontal care.'
    }
  },
  natural: {
    keywords: ['натуральн', 'органічн', 'веган', 'natural', 'organic', 'vegan', 'eco'],
    recommendation: {
      uk: 'Натуральні та веганські продукти:\n\n1. **Bio-Natural with Herbs** (€159) - створено природою\n2. **Vegan with Vitamin B12** (€159) - 100% веганська формула\n3. **Perio Care CBD** (€179) - з натуральним екстрактом конопель\n\nВсі продукти без SLS, парабенів, тестування на тваринах!',
      en: 'Natural and vegan products:\n\n1. **Bio-Natural with Herbs** (€159) - created by nature\n2. **Vegan with Vitamin B12** (€159) - 100% vegan formula\n3. **Perio Care CBD** (€179) - with natural hemp extract\n\nAll products are SLS-free, paraben-free, cruelty-free!'
    }
  },
  premium: {
    keywords: ['дорогий', 'преміум', 'найкращ', 'люкс', 'premium', 'luxury', 'best', 'expensive'],
    recommendation: {
      uk: 'Преміальна серія Limited Edition:\n\n1. **Advanced Whitening Gold** (€219) - з золотом 24К\n2. **Diamond** (€199) - зі швейцарською алмазною пудрою\n3. **SPA Expert** (€189) - з водою льодовика Аржантьєра\n4. **Extra-Whitening Black** (€189) - з активованим вугіллям\n\n**Щітки**: Gold/Silver Limited Edition (€149)',
      en: 'Premium Limited Edition series:\n\n1. **Advanced Whitening Gold** (€219) - with 24K gold\n2. **Diamond** (€199) - with Swiss diamond powder\n3. **SPA Expert** (€189) - with Argentiere glacier water\n4. **Extra-Whitening Black** (€189) - with activated charcoal\n\n**Brushes**: Gold/Silver Limited Edition (€149)'
    }
  },
  pregnant: {
    keywords: ['вагітн', 'мама', 'pregnant', 'pregnancy', 'mother'],
    recommendation: {
      uk: 'Для вагітних і молодих мам:\n\n**Pregnant & Young Mum** (€159) - спеціальна формула:\n- Безпечна для вагітних\n- М\'які компоненти\n- Без агресивних речовин\n- Підходить для чутливих ясен\n\n**Щітка**: Sensitive (€89) з м\'якою щетиною',
      en: 'For pregnant and young mothers:\n\n**Pregnant & Young Mum** (€159) - special formula:\n- Safe for pregnancy\n- Gentle components\n- No aggressive substances\n- Suitable for sensitive gums\n\n**Brush**: Sensitive (€89) with soft bristles'
    }
  }
};

export class AIAssistant {
  private lang: string;
  private useRealAI: boolean;
  private conversationHistory: Array<{ role: string; content: string }> = [];

  constructor(language: string = 'uk') {
    this.lang = language;
    this.useRealAI = !!(AI_CONFIG.gemini.apiKey || AI_CONFIG.huggingface.apiKey);
  }

  setLanguage(language: string) {
    this.lang = language;
  }

  setApiKey(provider: 'gemini' | 'huggingface', key: string) {
    localStorage.setItem(`${provider === 'gemini' ? 'gemini' : 'hf'}_api_key`, key);
    if (provider === 'gemini') {
      AI_CONFIG.gemini.apiKey = key;
    } else {
      AI_CONFIG.huggingface.apiKey = key;
    }
    this.useRealAI = true;
  }

  private getSystemPrompt(): string {
    const prompts = {
      uk: `Ти - професійний консультант Dentissimo, швейцарського бренду преміальних засобів для догляду за зубами. 

Наші продукти:

ПРЕМІАЛЬНА СЕРІЯ LIMITED EDITION:
- SPA Expert (€189) - з термальною водою льодовика Аржантьєра, для чутливих зубів
- Diamond (€199) - зі швейцарською алмазною пудрою, делікатний догляд
- Advanced Whitening Gold (€219) - з золотом 24К, найпотужніше відбілювання
- Extra-Whitening Black (€189) - з активованим вугіллям, природне відбілювання

ПРОФЕСІЙНА СЕРІЯ:
- Complete Care (€159) - комплекс Regera-Pro, повний догляд
- Pro-Whitening (€159) - професійне відбілювання
- Pro Care Teeth & Gums (€159) - для ясен і зубів
- Pregnant & Young Mum (€159) - безпечна для вагітних

НАТУРАЛЬНА СЕРІЯ:
- Bio-Natural with Herbs (€159) - створено природою
- Vegan with Vitamin B12 (€159) - 100% веганська
- Perio Care CBD (€179) - з екстрактом конопель для ясен

ДИТЯЧА СЕРІЯ:
- Kids 2-6 Years (€139) - смак карамелі
- Junior 6+ Years (€139) - яблучний смак
- Kids Brush 2-6 Years (€69)
- Junior Brush 6+ Years (€69)

ЩІТКИ ДОРОСЛІ:
- Gold/Silver Limited Edition (€149)
- Whitening (€99)
- Sensitive (€89) - м'яка щетина
- Parodontal (€99) - для ясен

ІНШЕ:
- Ополаскувач (€169)

ПЕРЕВАГИ DENTISSIMO:
✓ Швейцарська якість
✓ Без SLS, парабенів
✓ Не тестується на тваринах
✓ Преміум інгредієнти
✓ Доставка: безкоштовна від €100, по Україні 1-3 дні, Європа 3-7 днів

Твоя задача - розуміти проблеми клієнта та рекомендувати найкращі продукти. Будь дружнім, професійним та корисним. Відповідай українською мовою.`,

      en: `You are a professional Dentissimo consultant, a Swiss premium oral care brand.

OUR PRODUCTS:

LIMITED EDITION PREMIUM:
- SPA Expert (€189) - Argentiere glacier thermal water, sensitive teeth
- Diamond (€199) - Swiss diamond powder, gentle care
- Advanced Whitening Gold (€219) - 24K gold, most powerful whitening
- Extra-Whitening Black (€189) - activated charcoal, natural whitening

PROFESSIONAL SERIES:
- Complete Care (€159) - Regera-Pro complex, complete care
- Pro-Whitening (€159) - professional whitening
- Pro Care Teeth & Gums (€159) - for gums and teeth
- Pregnant & Young Mum (€159) - safe for pregnant women

NATURAL SERIES:
- Bio-Natural with Herbs (€159) - created by nature
- Vegan with Vitamin B12 (€159) - 100% vegan
- Perio Care CBD (€179) - hemp extract for gums

KIDS SERIES:
- Kids 2-6 Years (€139) - caramel flavor
- Junior 6+ Years (€139) - apple flavor
- Kids Brush 2-6 Years (€69)
- Junior Brush 6+ Years (€69)

ADULT BRUSHES:
- Gold/Silver Limited Edition (€149)
- Whitening (€99)
- Sensitive (€89) - soft bristles
- Parodontal (€99) - for gums

OTHER:
- Mouthwash (€169)

DENTISSIMO BENEFITS:
✓ Swiss quality
✓ SLS-free, paraben-free
✓ Cruelty-free
✓ Premium ingredients
✓ Delivery: free from €100, Ukraine 1-3 days, Europe 3-7 days

Your task is to understand customer problems and recommend the best products. Be friendly, professional and helpful. Respond in English.`
    };

    return prompts[this.lang as keyof typeof prompts] || prompts.uk;
  }

  private async callGeminiAPI(userMessage: string): Promise<string> {
    try {
      const response = await fetch(
        `${AI_CONFIG.gemini.endpoint}?key=${AI_CONFIG.gemini.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `${this.getSystemPrompt()}\n\nКлієнт: ${userMessage}\n\nКонсультант:`
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 500,
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  }

  private async callHuggingFaceAPI(userMessage: string): Promise<string> {
    try {
      const response = await fetch(
        `${AI_CONFIG.huggingface.endpoint}${AI_CONFIG.huggingface.model}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${AI_CONFIG.huggingface.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: `${this.getSystemPrompt()}\n\nКлієнт: ${userMessage}\n\nКонсультант:`,
            parameters: {
              max_new_tokens: 500,
              temperature: 0.7,
              return_full_text: false
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`HuggingFace API error: ${response.status}`);
      }

      const data = await response.json();
      return data[0].generated_text;
    } catch (error) {
      console.error('HuggingFace API error:', error);
      throw error;
    }
  }

  private getGreeting(): string {
    const greetings = {
      uk: 'Вітаю! Я AI-консультант Dentissimo. Допоможу вам обрати ідеальний продукт для догляду за зубами. Що вас цікавить?',
      en: 'Hello! I\'m Dentissimo AI consultant. I\'ll help you choose the perfect oral care product. What are you interested in?'
    };
    return greetings[this.lang as keyof typeof greetings] || greetings.uk;
  }

  private getDefaultResponse(): string {
    const responses = {
      uk: 'Я можу допомогти вам з:\n\n🦷 Відбілюванням зубів\n💎 Чутливими зубами\n👶 Продуктами для дітей\n🌿 Натуральними/веганськими пастами\n💉 Проблемами з яснами\n👑 Преміальними продуктами\n🤰 Засобами для вагітних\n\nПросто опишіть вашу проблему або побажання!',
      en: 'I can help you with:\n\n🦷 Teeth whitening\n💎 Sensitive teeth\n👶 Products for kids\n🌿 Natural/vegan toothpastes\n💉 Gum problems\n👑 Premium products\n🤰 Products for pregnant women\n\nJust describe your problem or wishes!'
    };
    return responses[this.lang as keyof typeof responses] || responses.uk;
  }

  async getResponse(userMessage: string): Promise<string> {
    // Try real AI first if API key is available
    if (this.useRealAI) {
      try {
        // Try Gemini first (better quality)
        if (AI_CONFIG.gemini.apiKey) {
          const response = await this.callGeminiAPI(userMessage);
          this.conversationHistory.push(
            { role: 'user', content: userMessage },
            { role: 'assistant', content: response }
          );
          return response;
        }
        
        // Fallback to HuggingFace
        if (AI_CONFIG.huggingface.apiKey) {
          const response = await this.callHuggingFaceAPI(userMessage);
          this.conversationHistory.push(
            { role: 'user', content: userMessage },
            { role: 'assistant', content: response }
          );
          return response;
        }
      } catch (error) {
        console.error('AI API failed, falling back to keyword matching:', error);
        // Fall through to keyword matching
      }
    }

    // Fallback to keyword-based responses
    const lowerMessage = userMessage.toLowerCase();

    // Check each category
    for (const [category, data] of Object.entries(productKnowledge)) {
      const hasKeyword = data.keywords.some(keyword => 
        lowerMessage.includes(keyword.toLowerCase())
      );
      
      if (hasKeyword) {
        return data.recommendation[this.lang as keyof typeof data.recommendation] || 
               data.recommendation.uk;
      }
    }

    // Check for specific questions
    if (lowerMessage.includes('ціна') || lowerMessage.includes('price')) {
      const prices = {
        uk: 'Наші ціни:\n\n💎 Limited Edition: €189-219\n🦷 Зубні пасти: €159-179\n🪥 Щітки дорослі: €89-149\n👶 Дитячі продукти: €69-139\n💧 Ополаскувач: €169\n\nБезкоштовна доставка від €100!',
        en: 'Our prices:\n\n💎 Limited Edition: €189-219\n🦷 Toothpastes: €159-179\n🪥 Adult brushes: €89-149\n👶 Kids products: €69-139\n💧 Mouthwash: €169\n\nFree delivery from €100!'
      };
      return prices[this.lang as keyof typeof prices] || prices.uk;
    }

    if (lowerMessage.includes('доставка') || lowerMessage.includes('delivery') || lowerMessage.includes('shipping')) {
      const delivery = {
        uk: '📦 Доставка:\n\n✅ Безкоштовна доставка від €100\n🚚 По Україні: 1-3 дні\n🌍 Європа: 3-7 днів\n📍 Відстеження замовлення\n\nДоставляємо в усі європейські країни!',
        en: '📦 Delivery:\n\n✅ Free delivery from €100\n🚚 Ukraine: 1-3 days\n🌍 Europe: 3-7 days\n📍 Order tracking\n\nWe deliver to all European countries!'
      };
      return delivery[this.lang as keyof typeof delivery] || delivery.uk;
    }

    return this.getDefaultResponse();
  }

  isUsingRealAI(): boolean {
    return this.useRealAI;
  }

  getInitialMessage(): Message {
    return {
      id: Date.now().toString(),
      text: this.getGreeting(),
      isBot: true,
      timestamp: new Date()
    };
  }
}

export type { Message };
