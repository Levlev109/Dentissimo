// AI Assistant Service — smart keyword-based product consultant

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

// Product categories with multi-language keywords and recommendations
const productKnowledge: Record<string, { keywords: string[]; recommendation: Record<string, string> }> = {
  whitening: {
    keywords: ['білити', 'відбілювання', 'білі зуби', 'whitening', 'white', 'yellow', 'отбеливан', 'белые зубы', 'желт', 'белизн', 'белее', 'отбели', 'яскраві', 'сяючі', 'bright', 'stain', 'пятн', 'налет', 'наліт', 'потемн'],
    recommendation: {
      uk: 'Для відбілювання зубів рекомендую:\n\n1. **Advanced Whitening Gold** (€219) — найефективніша формула з золотом 24К\n2. **Extra-Whitening Black** (€189) — з натуральним активованим вугіллям\n3. **Pro-Whitening** (€159) — професійне відбілювання\n\nВсі ці пасти безпечні для емалі та дають видимий результат через 1-2 тижні.\n\n👉 Переходьте до розділу «Продукти» вище, щоб замовити!',
      en: 'For teeth whitening, I recommend:\n\n1. **Advanced Whitening Gold** (€219) — most effective formula with 24K gold\n2. **Extra-Whitening Black** (€189) — with natural activated charcoal\n3. **Pro-Whitening** (€159) — professional whitening\n\nAll safe for enamel with visible results in 1-2 weeks.\n\n👉 Go to "Products" section above to order!',
      ru: 'Для отбеливания зубов рекомендую:\n\n1. **Advanced Whitening Gold** (€219) — самая эффективная формула с золотом 24К\n2. **Extra-Whitening Black** (€189) — с натуральным активированным углём\n3. **Pro-Whitening** (€159) — профессиональное отбеливание\n\nВсе пасты безопасны для эмали, результат заметен через 1-2 недели.\n\n👉 Перейдите в раздел «Продукты» выше, чтобы заказать!'
    }
  },
  sensitive: {
    keywords: ['чутливі', 'болять', 'біль', 'sensitive', 'pain', 'hurt', 'чувствительн', 'боль', 'болят', 'реагируют на холод', 'реагують', 'холодн', 'гарячий', 'горяч', 'hot', 'cold', 'ломить', 'ломлять', 'ноет', 'ниє'],
    recommendation: {
      uk: 'Для чутливих зубів ідеально:\n\n1. **SPA Expert** (€189) — з термальною водою льодовика, ніжно доглядає\n2. **Complete Care** (€159) — комплекс Regera-Pro для захисту\n3. **Diamond** (€199) — алмазна пудра, делікатний догляд\n\n**Щітка**: Sensitive (€89) з м\'якою щетиною — знижує дискомфорт.\n\n👉 Переходьте до розділу «Продукти» вище!',
      en: 'For sensitive teeth, perfect choices:\n\n1. **SPA Expert** (€189) — with glacier thermal water, gentle care\n2. **Complete Care** (€159) — Regera-Pro complex for protection\n3. **Diamond** (€199) — diamond powder, delicate care\n\n**Brush**: Sensitive (€89) with soft bristles.\n\n👉 Go to "Products" section above!',
      ru: 'Для чувствительных зубов идеально:\n\n1. **SPA Expert** (€189) — с термальной водой ледника, нежный уход\n2. **Complete Care** (€159) — комплекс Regera-Pro для защиты\n3. **Diamond** (€199) — алмазная пудра, деликатный уход\n\n**Щётка**: Sensitive (€89) с мягкой щетиной.\n\n👉 Перейдите в раздел «Продукты» выше!'
    }
  },
  kids: {
    keywords: ['дитина', 'дітям', 'kids', 'children', 'child', 'ребенок', 'детям', 'детск', 'дитяч', 'малюк', 'малыш', 'рік', 'років', 'лет', 'year', 'школ', 'підліт', 'подрост'],
    recommendation: {
      uk: 'Для дітей у нас спеціальна серія:\n\n**2-6 років:**\n🍬 Kids 2-6 Years (€139) — смак карамелі\n🪥 Kids Brush 2-6 Years (€69) — м\'яка щітка\n\n**6+ років:**\n🍏 Junior 6+ Years (€139) — яблучний смак\n🪥 Junior Brush 6+ Years (€69)\n\nВсі продукти безпечні, без фтору, з приємним смаком! Діти полюбляють чистити зуби 😊\n\n👉 Переходьте до розділу «Продукти» вище!',
      en: 'For children we have a special series:\n\n**2-6 years:**\n🍬 Kids 2-6 Years (€139) — caramel flavor\n🪥 Kids Brush 2-6 Years (€69) — soft brush\n\n**6+ years:**\n🍏 Junior 6+ Years (€139) — apple flavor\n🪥 Junior Brush 6+ Years (€69)\n\nAll safe, fluoride-free, with pleasant taste!\n\n👉 Go to "Products" section above!',
      ru: 'Для детей у нас специальная серия:\n\n**2-6 лет:**\n🍬 Kids 2-6 Years (€139) — вкус карамели\n🪥 Kids Brush 2-6 Years (€69) — мягкая щётка\n\n**6+ лет:**\n🍏 Junior 6+ Years (€139) — яблочный вкус\n🪥 Junior Brush 6+ Years (€69)\n\nВсе продукты безопасны, без фтора, с приятным вкусом!\n\n👉 Перейдите в раздел «Продукты» выше!'
    }
  },
  gums: {
    keywords: ['ясна', 'кровоточать', 'запалення', 'gums', 'bleeding', 'inflammation', 'десна', 'десны', 'кровоточ', 'воспален', 'пародонт', 'gingivit', 'гінгівіт', 'опухл', 'набряк', 'swell'],
    recommendation: {
      uk: 'При проблемах з яснами рекомендую:\n\n1. **Pro Care Teeth & Gums** (€159) — спеціально для ясен\n2. **Perio Care CBD** (€179) — з екстрактом конопель, зменшує запалення\n3. **Ополаскувач** (€169) — проти кровоточивості\n\n**Щітка**: Parodontal (€99) — спеціальна для пародонтального догляду.\n\n👉 Переходьте до розділу «Продукти» вище!',
      en: 'For gum problems, I recommend:\n\n1. **Pro Care Teeth & Gums** (€159) — specially for gums\n2. **Perio Care CBD** (€179) — with hemp extract, reduces inflammation\n3. **Mouthwash** (€169) — against bleeding\n\n**Brush**: Parodontal (€99) — special for periodontal care.\n\n👉 Go to "Products" section above!',
      ru: 'При проблемах с дёснами рекомендую:\n\n1. **Pro Care Teeth & Gums** (€159) — специально для дёсен\n2. **Perio Care CBD** (€179) — с экстрактом конопли, снижает воспаление\n3. **Ополаскиватель** (€169) — против кровоточивости\n\n**Щётка**: Parodontal (€99) — для пародонтального ухода.\n\n👉 Перейдите в раздел «Продукты» выше!'
    }
  },
  natural: {
    keywords: ['натуральн', 'органічн', 'веган', 'natural', 'organic', 'vegan', 'eco', 'органик', 'эко', 'без химии', 'без хімії', 'травы', 'трави', 'herb', 'рослинн', 'растительн'],
    recommendation: {
      uk: 'Натуральні та веганські продукти:\n\n1. **Bio-Natural with Herbs** (€159) — створено природою, на травах\n2. **Vegan with Vitamin B12** (€159) — 100% веганська формула\n3. **Perio Care CBD** (€179) — з натуральним екстрактом конопель\n\nВсі продукти без SLS, парабенів, не тестуються на тваринах! 🌿\n\n👉 Переходьте до розділу «Продукти» вище!',
      en: 'Natural and vegan products:\n\n1. **Bio-Natural with Herbs** (€159) — created by nature\n2. **Vegan with Vitamin B12** (€159) — 100% vegan formula\n3. **Perio Care CBD** (€179) — with natural hemp extract\n\nAll SLS-free, paraben-free, cruelty-free! 🌿\n\n👉 Go to "Products" section above!',
      ru: 'Натуральные и веганские продукты:\n\n1. **Bio-Natural with Herbs** (€159) — создано природой, на травах\n2. **Vegan with Vitamin B12** (€159) — 100% веганская формула\n3. **Perio Care CBD** (€179) — с натуральным экстрактом конопли\n\nВсё без SLS, парабенов, не тестируется на животных! 🌿\n\n👉 Перейдите в раздел «Продукты» выше!'
    }
  },
  premium: {
    keywords: ['дорогий', 'преміум', 'найкращ', 'люкс', 'premium', 'luxury', 'best', 'expensive', 'лучш', 'дорог', 'элитн', 'елітн', 'подарок', 'подарунок', 'gift', 'exclusive', 'ексклюзив', 'эксклюзив'],
    recommendation: {
      uk: 'Преміальна серія Limited Edition:\n\n1. **Advanced Whitening Gold** (€219) — з золотом 24К ✨\n2. **Diamond** (€199) — зі швейцарською алмазною пудрою 💎\n3. **SPA Expert** (€189) — з водою льодовика Аржантьєра 🏔️\n4. **Extra-Whitening Black** (€189) — з активованим вугіллям\n\n**Щітки**: Gold/Silver Limited Edition (€149) — 6500 щетинок!\n\nІдеально як подарунок 🎁\n\n👉 Переходьте до розділу «Продукти» вище!',
      en: 'Premium Limited Edition series:\n\n1. **Advanced Whitening Gold** (€219) — with 24K gold ✨\n2. **Diamond** (€199) — with Swiss diamond powder 💎\n3. **SPA Expert** (€189) — with Argentiere glacier water 🏔️\n4. **Extra-Whitening Black** (€189) — with activated charcoal\n\n**Brushes**: Gold/Silver Limited Edition (€149) — 6500 bristles!\n\nPerfect as a gift 🎁\n\n👉 Go to "Products" section above!',
      ru: 'Премиальная серия Limited Edition:\n\n1. **Advanced Whitening Gold** (€219) — с золотом 24К ✨\n2. **Diamond** (€199) — со швейцарской алмазной пудрой 💎\n3. **SPA Expert** (€189) — с водой ледника Аржантьер 🏔️\n4. **Extra-Whitening Black** (€189) — с активированным углём\n\n**Щётки**: Gold/Silver Limited Edition (€149) — 6500 щетинок!\n\nИдеально как подарок 🎁\n\n👉 Перейдите в раздел «Продукты» выше!'
    }
  },
  pregnant: {
    keywords: ['вагітн', 'мама', 'pregnant', 'pregnancy', 'mother', 'беременн', 'мам', 'годувальн', 'кормящ', 'nursing', 'breastfeed'],
    recommendation: {
      uk: 'Для вагітних і молодих мам:\n\n**Pregnant & Young Mum** (€159) — спеціальна формула:\n✅ Безпечна для вагітних та годувальниць\n✅ М\'які компоненти\n✅ Без агресивних речовин\n✅ Підходить для чутливих ясен\n\n**Щітка**: Sensitive (€89) з м\'якою щетиною\n\n👉 Переходьте до розділу «Продукти» вище!',
      en: 'For pregnant and young mothers:\n\n**Pregnant & Young Mum** (€159) — special formula:\n✅ Safe for pregnancy and nursing\n✅ Gentle components\n✅ No aggressive substances\n✅ Suitable for sensitive gums\n\n**Brush**: Sensitive (€89) with soft bristles\n\n👉 Go to "Products" section above!',
      ru: 'Для беременных и молодых мам:\n\n**Pregnant & Young Mum** (€159) — специальная формула:\n✅ Безопасна для беременных и кормящих\n✅ Мягкие компоненты\n✅ Без агрессивных веществ\n✅ Подходит для чувствительных дёсен\n\n**Щётка**: Sensitive (€89) с мягкой щетиной\n\n👉 Перейдите в раздел «Продукты» выше!'
    }
  },
  toothpaste: {
    keywords: ['паст', 'зубн', 'зубная', 'toothpaste', 'paste', 'tooth'],
    recommendation: {
      uk: 'У нас є зубні пасти для будь-яких потреб:\n\n💎 **Преміум** (€189-219): Advanced Whitening Gold, Diamond, SPA Expert, Extra-Whitening Black\n🦷 **Професійна** (€159): Complete Care, Pro-Whitening, Pro Care Teeth & Gums\n🌿 **Натуральна** (€159-179): Bio-Natural, Vegan B12, Perio Care CBD\n🤰 **Спеціальна** (€159): Pregnant & Young Mum\n👶 **Дитяча** (€139): Kids 2-6, Junior 6+\n\nЩо саме вас цікавить? Відбілювання, чутливі зуби, натуральний склад?',
      en: 'We have toothpastes for every need:\n\n💎 **Premium** (€189-219): Advanced Whitening Gold, Diamond, SPA Expert, Extra-Whitening Black\n🦷 **Professional** (€159): Complete Care, Pro-Whitening, Pro Care Teeth & Gums\n🌿 **Natural** (€159-179): Bio-Natural, Vegan B12, Perio Care CBD\n🤰 **Special** (€159): Pregnant & Young Mum\n👶 **Kids** (€139): Kids 2-6, Junior 6+\n\nWhat interests you? Whitening, sensitive teeth, natural ingredients?',
      ru: 'У нас есть зубные пасты для любых потребностей:\n\n💎 **Премиум** (€189-219): Advanced Whitening Gold, Diamond, SPA Expert, Extra-Whitening Black\n🦷 **Профессиональная** (€159): Complete Care, Pro-Whitening, Pro Care Teeth & Gums\n🌿 **Натуральная** (€159-179): Bio-Natural, Vegan B12, Perio Care CBD\n🤰 **Специальная** (€159): Pregnant & Young Mum\n👶 **Детская** (€139): Kids 2-6, Junior 6+\n\nЧто именно вас интересует? Отбеливание, чувствительные зубы, натуральный состав?'
    }
  },
  brush: {
    keywords: ['щітк', 'щетк', 'brush', 'зубна щітка', 'зубная щетка', 'bristle', 'щетин'],
    recommendation: {
      uk: 'Наші зубні щітки:\n\n👑 **Преміум**: Gold/Silver Limited Edition (€149) — 6500 щетинок\n🦷 **Для відбілювання**: Whitening (€99) — середня жорсткість\n💎 **Для чутливих**: Sensitive (€89) — м\'яка щетина\n🏥 **Для ясен**: Parodontal (€99) — спеціальний догляд\n👶 **Дитячі**: Kids 2-6 (€69), Junior 6+ (€69)\n\nЯку проблему хочете вирішити?',
      en: 'Our toothbrushes:\n\n👑 **Premium**: Gold/Silver Limited Edition (€149) — 6500 bristles\n🦷 **Whitening**: Whitening (€99) — medium hardness\n💎 **Sensitive**: Sensitive (€89) — soft bristles\n🏥 **Gums**: Parodontal (€99) — special care\n👶 **Kids**: Kids 2-6 (€69), Junior 6+ (€69)\n\nWhat problem do you want to solve?',
      ru: 'Наши зубные щётки:\n\n👑 **Премиум**: Gold/Silver Limited Edition (€149) — 6500 щетинок\n🦷 **Для отбеливания**: Whitening (€99) — средняя жёсткость\n💎 **Для чувствительных**: Sensitive (€89) — мягкая щетина\n🏥 **Для дёсен**: Parodontal (€99) — специальный уход\n👶 **Детские**: Kids 2-6 (€69), Junior 6+ (€69)\n\nКакую проблему хотите решить?'
    }
  },
  mouthwash: {
    keywords: ['ополіскувач', 'ополаскуватель', 'mouthwash', 'rinse', 'ополаскиватель', 'полоскан', 'рот', 'mouth'],
    recommendation: {
      uk: 'Наш **Ополаскувач для порожнини рота** (€169):\n\n✅ Захист від бактерій\n✅ Свіжий подих до 12 годин\n✅ Зміцнення ясен\n✅ Без спирту\n✅ Підходить для щоденного використання\n\nІдеально доповнює будь-яку пасту Dentissimo!\n\n👉 Переходьте до розділу «Продукти» вище!',
      en: 'Our **Mouthwash** (€169):\n\n✅ Bacteria protection\n✅ Fresh breath up to 12 hours\n✅ Gum strengthening\n✅ Alcohol-free\n✅ For daily use\n\nPerfectly complements any Dentissimo toothpaste!\n\n👉 Go to "Products" section above!',
      ru: 'Наш **Ополаскиватель для полости рта** (€169):\n\n✅ Защита от бактерий\n✅ Свежее дыхание до 12 часов\n✅ Укрепление дёсен\n✅ Без спирта\n✅ Для ежедневного использования\n\nИдеально дополняет любую пасту Dentissimo!\n\n👉 Перейдите в раздел «Продукты» выше!'
    }
  },
  completeCare: {
    keywords: ['комплексн', 'повний догляд', 'complete', 'все в одн', 'всё в одн', 'universal', 'універсальн', 'полный уход'],
    recommendation: {
      uk: 'Для комплексного догляду рекомендую:\n\n**Complete Care** (€159) — формула «все в одному»:\n✅ Комплекс Regera-Pro\n✅ Захист емалі\n✅ Профілактика карієсу\n✅ Свіжий подих\n✅ Доступна ціна\n\nЦе найпопулярніший вибір серед наших клієнтів!\n\n👉 Переходьте до розділу «Продукти» вище!',
      en: 'For complete care, I recommend:\n\n**Complete Care** (€159) — all-in-one formula:\n✅ Regera-Pro complex\n✅ Enamel protection\n✅ Cavity prevention\n✅ Fresh breath\n✅ Affordable price\n\nThis is our most popular choice!\n\n👉 Go to "Products" section above!',
      ru: 'Для комплексного ухода рекомендую:\n\n**Complete Care** (€159) — формула «всё в одном»:\n✅ Комплекс Regera-Pro\n✅ Защита эмали\n✅ Профилактика кариеса\n✅ Свежее дыхание\n✅ Доступная цена\n\nЭто самый популярный выбор наших клиентов!\n\n👉 Перейдите в раздел «Продукты» выше!'
    }
  }
};

// Conversational patterns (greetings, help, ordering, etc.)
const conversationalPatterns: Record<string, { patterns: string[]; response: Record<string, string> }> = {
  greeting: {
    patterns: ['привіт', 'привет', 'здрастуй', 'здравствуй', 'добрий день', 'добрий ранок', 'добрий вечір', 'добрый день', 'доброе утро', 'добрый вечер', 'hello', 'hi', 'hey', 'good morning', 'good evening', 'вітаю', 'салют', 'здоров', 'hola'],
    response: {
      uk: 'Вітаю! 😊 Радий вас бачити!\n\nЯ AI-консультант Dentissimo — допоможу підібрати ідеальний засіб для догляду за зубами.\n\nРозкажіть, що вас цікавить:\n• Відбілювання зубів?\n• Чутливі зуби чи ясна?\n• Продукти для дітей?\n• Натуральні/веганські засоби?\n• Преміум-серія?\n\nАбо просто опишіть вашу проблему!',
      en: 'Hello! 😊 Great to see you!\n\nI\'m Dentissimo AI consultant — I\'ll help find the perfect oral care product.\n\nTell me what interests you:\n• Teeth whitening?\n• Sensitive teeth or gums?\n• Products for kids?\n• Natural/vegan products?\n• Premium series?\n\nOr just describe your problem!',
      ru: 'Привет! 😊 Рад вас видеть!\n\nЯ AI-консультант Dentissimo — помогу подобрать идеальное средство для ухода за зубами.\n\nРасскажите, что вас интересует:\n• Отбеливание зубов?\n• Чувствительные зубы или дёсны?\n• Продукты для детей?\n• Натуральные/веганские средства?\n• Премиум-серия?\n\nИли просто опишите вашу проблему!'
    }
  },
  help: {
    patterns: ['помож', 'допомож', 'підкаж', 'подскаж', 'порад', 'порекоменд', 'посовет', 'рекоменд', 'suggest', 'recommend', 'help', 'advice', 'порада', 'совет', 'що обрати', 'что выбрать', 'what to choose', 'не знаю що', 'не знаю что', 'що краще', 'что лучше'],
    response: {
      uk: 'Із задоволенням допоможу! 🤝\n\nЩоб підібрати ідеальний продукт, розкажіть мені:\n\n1. **Яка головна проблема?**\n   • Жовтуватий відтінок зубів?\n   • Чутливість до холодного/гарячого?\n   • Кровоточивість ясен?\n   • Потрібен комплексний догляд?\n\n2. **Для кого шукаєте?**\n   • Для себе, для дитини, для вагітної?\n\n3. **Важливо щось конкретне?**\n   • Натуральний склад, веганська формула?\n\nПросто напишіть — і я підберу найкраще! 💪',
      en: 'Happy to help! 🤝\n\nTo find the perfect product, tell me:\n\n1. **What\'s the main concern?**\n   • Yellowish teeth?\n   • Sensitivity to cold/hot?\n   • Bleeding gums?\n   • Need complete care?\n\n2. **Who is it for?**\n   • Yourself, a child, pregnant woman?\n\n3. **Anything specific?**\n   • Natural, vegan formula?\n\nJust write — I\'ll find the best match! 💪',
      ru: 'С удовольствием помогу! 🤝\n\nЧтобы подобрать идеальный продукт, расскажите:\n\n1. **Какая главная проблема?**\n   • Желтоватый оттенок зубов?\n   • Чувствительность к холодному/горячему?\n   • Кровоточивость дёсен?\n   • Нужен комплексный уход?\n\n2. **Для кого ищете?**\n   • Для себя, для ребёнка, для беременной?\n\n3. **Важно что-то конкретное?**\n   • Натуральный состав, веганская формула?\n\nПросто напишите — я подберу лучшее! 💪'
    }
  },
  ordering: {
    patterns: ['замов', 'заказ', 'купити', 'купить', 'order', 'buy', 'purchase', 'оформити', 'оформить', 'як купити', 'как купить', 'how to buy', 'кошик', 'корзин', 'cart', 'оплат', 'payment', 'pay'],
    response: {
      uk: '🛒 Як зробити замовлення:\n\n1. Перейдіть до розділу **«Продукти»** на сайті\n2. Натисніть **«Додати до кошика»** на потрібних продуктах\n3. Відкрийте **кошик** (іконка вгорі) та натисніть **«Оформити»**\n4. Заповніть контактні дані та адресу доставки\n5. Оберіть відділення Нової Пошти\n6. Підтвердіть замовлення!\n\n📦 **Доставка безкоштовна від €100!**\n🇺🇦 По Україні: 1-3 дні\n🌍 Європа: 3-7 днів\n\nЧи потрібна допомога з вибором продукту?',
      en: '🛒 How to order:\n\n1. Go to the **"Products"** section\n2. Click **"Add to cart"** on desired products\n3. Open the **cart** (icon at top) and click **"Checkout"**\n4. Fill in your contact details and delivery address\n5. Confirm your order!\n\n📦 **Free delivery from €100!**\n🇺🇦 Ukraine: 1-3 days\n🌍 Europe: 3-7 days\n\nNeed help choosing a product?',
      ru: '🛒 Как сделать заказ:\n\n1. Перейдите в раздел **«Продукты»** на сайте\n2. Нажмите **«Добавить в корзину»** на нужных продуктах\n3. Откройте **корзину** (иконка вверху) и нажмите **«Оформить»**\n4. Заполните контактные данные и адрес доставки\n5. Выберите отделение Новой Почты\n6. Подтвердите заказ!\n\n📦 **Доставка бесплатна от €100!**\n🇺🇦 По Украине: 1-3 дня\n🌍 Европа: 3-7 дней\n\nНужна помощь с выбором продукта?'
    }
  },
  about: {
    patterns: ['dentissimo', 'бренд', 'brand', 'компанія', 'компания', 'company', 'хто ви', 'кто вы', 'who are you', 'про вас', 'о вас', 'about you', 'що за', 'what is', 'розкажи про', 'расскажи про', 'tell me about', 'швейцар', 'swiss'],
    response: {
      uk: '🇨🇭 **Dentissimo** — швейцарський преміальний бренд засобів для догляду за зубами.\n\n**Наші переваги:**\n✅ Швейцарська якість та технології\n✅ Преміум інгредієнти (золото 24К, алмазна пудра, термальна вода, CBD)\n✅ Без SLS, парабенів, мікропластику\n✅ Не тестуємося на тваринах 🐰\n✅ Лінійка для всієї родини (дорослі, діти, вагітні)\n✅ Безкоштовна доставка від €100\n\n**Серії:** Limited Edition, Professional, Natural, Kids\n\nЩо саме вас цікавить? Можу підібрати ідеальний продукт!',
      en: '🇨🇭 **Dentissimo** — Swiss premium oral care brand.\n\n**Our advantages:**\n✅ Swiss quality and technology\n✅ Premium ingredients (24K gold, diamond powder, thermal water, CBD)\n✅ SLS-free, paraben-free, microplastic-free\n✅ Cruelty-free 🐰\n✅ Products for the whole family\n✅ Free delivery from €100\n\n**Series:** Limited Edition, Professional, Natural, Kids\n\nWhat interests you? I can find the perfect product!',
      ru: '🇨🇭 **Dentissimo** — швейцарский премиальный бренд средств для ухода за зубами.\n\n**Наши преимущества:**\n✅ Швейцарское качество и технологии\n✅ Премиум-ингредиенты (золото 24К, алмазная пудра, термальная вода, CBD)\n✅ Без SLS, парабенов, микропластика\n✅ Не тестируемся на животных 🐰\n✅ Линейка для всей семьи\n✅ Бесплатная доставка от €100\n\n**Серии:** Limited Edition, Professional, Natural, Kids\n\nЧто именно вас интересует? Могу подобрать идеальный продукт!'
    }
  },
  price: {
    patterns: ['ціна', 'цена', 'price', 'cost', 'скільки', 'сколько', 'how much', 'дорого', 'дешево', 'бюджет', 'budget', 'affordable', 'знижк', 'скидк', 'discount', 'акці', 'акци', 'sale', 'промо', 'promo'],
    response: {
      uk: '💰 Ціни на продукти Dentissimo:\n\n💎 **Limited Edition**: €189-219\n🦷 **Професійні пасти**: €159\n🌿 **Натуральні пасти**: €159-179\n🪥 **Щітки дорослі**: €89-149\n👶 **Дитячі продукти**: €69-139\n💧 **Ополаскувач**: €169\n\n🎁 **Безкоштовна доставка від €100!**\n\nМожу порадити оптимальний набір під ваш бюджет — просто напишіть, скільки готові витратити!',
      en: '💰 Dentissimo prices:\n\n💎 **Limited Edition**: €189-219\n🦷 **Professional pastes**: €159\n🌿 **Natural pastes**: €159-179\n🪥 **Adult brushes**: €89-149\n👶 **Kids products**: €69-139\n💧 **Mouthwash**: €169\n\n🎁 **Free delivery from €100!**\n\nI can suggest the best set for your budget — just tell me how much you want to spend!',
      ru: '💰 Цены на продукты Dentissimo:\n\n💎 **Limited Edition**: €189-219\n🦷 **Профессиональные пасты**: €159\n🌿 **Натуральные пасты**: €159-179\n🪥 **Щётки взрослые**: €89-149\n👶 **Детские продукты**: €69-139\n💧 **Ополаскиватель**: €169\n\n🎁 **Бесплатная доставка от €100!**\n\nМогу посоветовать оптимальный набор под ваш бюджет — просто напишите, сколько готовы потратить!'
    }
  },
  delivery: {
    patterns: ['доставка', 'delivery', 'shipping', 'ship', 'відправк', 'отправк', 'пошта', 'почта', 'post', 'nova poshta', 'нова пошта', 'курьер', 'courier', 'скільки доставка', 'сколько доставка', 'коли прийде', 'когда придет', 'when arrive', 'tracking', 'трек'],
    response: {
      uk: '📦 Доставка Dentissimo:\n\n✅ **Безкоштовна** при замовленні від €100\n🇺🇦 **Україна** (Нова Пошта): 1-3 робочі дні\n🌍 **Європа**: 3-7 робочих днів\n📍 Відстеження замовлення після відправки\n💳 Оплата при отриманні або онлайн\n\nДоставляємо по всій Україні та Європі! 🚚\n\nЧи є ще питання?',
      en: '📦 Dentissimo delivery:\n\n✅ **Free** for orders from €100\n🇺🇦 **Ukraine**: 1-3 business days\n🌍 **Europe**: 3-7 business days\n📍 Order tracking after dispatch\n💳 Pay on delivery or online\n\nWe deliver across Ukraine and Europe! 🚚\n\nAny other questions?',
      ru: '📦 Доставка Dentissimo:\n\n✅ **Бесплатная** при заказе от €100\n🇺🇦 **Украина** (Новая Почта): 1-3 рабочих дня\n🌍 **Европа**: 3-7 рабочих дней\n📍 Отслеживание заказа после отправки\n💳 Оплата при получении или онлайн\n\nДоставляем по всей Украине и Европе! 🚚\n\nЕсть ещё вопросы?'
    }
  },
  thanks: {
    patterns: ['дякую', 'спасибо', 'thank', 'thanks', 'дяк', 'thx', 'круто', 'клас', 'класс', 'cool', 'great', 'awesome', 'супер', 'чудово', 'отлично', 'замечательно'],
    response: {
      uk: 'Будь ласка! 😊 Радий, що зміг допомогти!\n\nЯкщо виникнуть ще питання — пишіть у будь-який час. Завжди на зв\'язку! 💬\n\nБажаю гарного дня та красивої усмішки! ✨',
      en: 'You\'re welcome! 😊 Glad I could help!\n\nIf you have more questions — feel free to ask anytime! 💬\n\nHave a beautiful day and a bright smile! ✨',
      ru: 'Пожалуйста! 😊 Рад, что смог помочь!\n\nЕсли возникнут ещё вопросы — пишите в любое время! 💬\n\nЖелаю хорошего дня и красивой улыбки! ✨'
    }
  },
  breath: {
    patterns: ['запах', 'подих', 'дыхание', 'дихання', 'breath', 'smell', 'свіж', 'свеж', 'fresh', 'галітоз', 'halitosis', 'воня', 'вонь', 'stink', 'неприятн'],
    response: {
      uk: 'Для свіжого подиху рекомендую комбінацію:\n\n1. **Complete Care** (€159) — тривала свіжість подиху\n2. **Ополаскувач** (€169) — захист від бактерій до 12 годин\n3. **Bio-Natural with Herbs** (€159) — натуральні трави освіжають подих\n\n💡 **Порада**: Використовуйте пасту + ополаскувач для максимального ефекту!\n\n👉 Переходьте до розділу «Продукти» вище!',
      en: 'For fresh breath, I recommend:\n\n1. **Complete Care** (€159) — long-lasting freshness\n2. **Mouthwash** (€169) — bacteria protection up to 12 hours\n3. **Bio-Natural with Herbs** (€159) — natural herbs refresh breath\n\n💡 **Tip**: Use toothpaste + mouthwash for maximum effect!\n\n👉 Go to "Products" section above!',
      ru: 'Для свежего дыхания рекомендую комбинацию:\n\n1. **Complete Care** (€159) — длительная свежесть дыхания\n2. **Ополаскиватель** (€169) — защита от бактерий до 12 часов\n3. **Bio-Natural with Herbs** (€159) — натуральные травы освежают дыхание\n\n💡 **Совет**: Используйте пасту + ополаскиватель для максимального эффекта!\n\n👉 Перейдите в раздел «Продукты» выше!'
    }
  },
  cavities: {
    patterns: ['карієс', 'кариес', 'cavity', 'caries', 'дірка', 'дырка', 'hole', 'руйнуван', 'разрушен', 'decay', 'емаль', 'эмаль', 'enamel', 'зміцн', 'укреп', 'strengthen'],
    response: {
      uk: 'Для захисту від карієсу та зміцнення емалі:\n\n1. **Complete Care** (€159) — комплекс Regera-Pro зміцнює емаль\n2. **Diamond** (€199) — алмазна пудра для полірування та захисту\n3. **Ополаскувач** (€169) — додатковий антибактеріальний захист\n\n💡 **Порада**: Чистіть зуби 2 хв, 2 рази на день, та не забувайте про ополаскувач!\n\n👉 Переходьте до розділу «Продукти» вище!',
      en: 'For cavity protection and enamel strengthening:\n\n1. **Complete Care** (€159) — Regera-Pro complex strengthens enamel\n2. **Diamond** (€199) — diamond powder for polishing and protection\n3. **Mouthwash** (€169) — additional antibacterial protection\n\n💡 **Tip**: Brush for 2 min, twice daily, and don\'t forget mouthwash!\n\n👉 Go to "Products" section above!',
      ru: 'Для защиты от кариеса и укрепления эмали:\n\n1. **Complete Care** (€159) — комплекс Regera-Pro укрепляет эмаль\n2. **Diamond** (€199) — алмазная пудра для полировки и защиты\n3. **Ополаскиватель** (€169) — дополнительная антибактериальная защита\n\n💡 **Совет**: Чистите зубы 2 мин, 2 раза в день, и не забывайте про ополаскиватель!\n\n👉 Перейдите в раздел «Продукты» выше!'
    }
  }
};

export class AIAssistant {
  private lang: string;

  constructor(language: string = 'uk') {
    this.lang = language;
  }

  setLanguage(language: string) {
    this.lang = language;
  }

  private getLangKey(): string {
    if (this.lang.startsWith('ru')) return 'ru';
    if (this.lang.startsWith('en')) return 'en';
    return 'uk';
  }

  private getGreeting(): string {
    const greetings: Record<string, string> = {
      uk: 'Вітаю! 👋 Я AI-консультант Dentissimo.\n\nДопоможу підібрати ідеальну зубну пасту, щітку чи ополаскувач. Просто напишіть що вас цікавить, наприклад:\n\n• «Потрібна паста для відбілювання»\n• «Болять зуби від холодного»\n• «Що підійде дитині 4 роки?»\n• «Розкажіть про Dentissimo»\n• «Як зробити замовлення?»\n\nЧим можу допомогти? 😊',
      en: 'Hello! 👋 I\'m Dentissimo AI consultant.\n\nI\'ll help you choose the perfect toothpaste, brush or mouthwash. Just tell me what you need:\n\n• "I need a whitening toothpaste"\n• "My teeth hurt from cold"\n• "What\'s good for a 4-year-old?"\n• "Tell me about Dentissimo"\n• "How do I order?"\n\nHow can I help? 😊',
      ru: 'Привет! 👋 Я AI-консультант Dentissimo.\n\nПомогу подобрать идеальную зубную пасту, щётку или ополаскиватель. Просто напишите что вас интересует:\n\n• «Нужна паста для отбеливания»\n• «Болят зубы от холодного»\n• «Что подойдёт ребёнку 4 лет?»\n• «Расскажите о Dentissimo»\n• «Как сделать заказ?»\n\nЧем могу помочь? 😊'
    };
    return greetings[this.getLangKey()] || greetings.uk;
  }

  private getDefaultResponse(): string {
    const responses: Record<string, string> = {
      uk: 'Цікаве питання! 🤔 Ось чим я можу допомогти:\n\n🦷 **Відбілювання** — напишіть «відбілювання» або «білі зуби»\n💎 **Чутливі зуби** — «чутливі зуби» або «болять зуби»\n👶 **Для дітей** — «для дітей» або «для дитини»\n🌿 **Натуральне** — «натуральна» або «веган»\n💉 **Проблеми з яснами** — «ясна» або «кровоточать»\n👑 **Преміум** — «преміум» або «подарунок»\n🤰 **Для вагітних** — «вагітність» або «для мами»\n🪥 **Щітки** — «щітка» або «brush»\n💧 **Ополаскувач** — «ополаскувач»\n🛒 **Як замовити** — «замовити» або «купити»\n📦 **Доставка** — «доставка»\n💰 **Ціни** — «ціна» або «скільки коштує»\n\nАбо просто опишіть вашу проблему — я підберу найкраще! 💪',
      en: 'Interesting question! 🤔 Here\'s what I can help with:\n\n🦷 **Whitening** — type "whitening" or "white teeth"\n💎 **Sensitive teeth** — "sensitive" or "teeth hurt"\n👶 **For kids** — "kids" or "children"\n🌿 **Natural** — "natural" or "vegan"\n💉 **Gum problems** — "gums" or "bleeding"\n👑 **Premium** — "premium" or "gift"\n🤰 **Pregnant** — "pregnant" or "mother"\n🪥 **Brushes** — "brush"\n💧 **Mouthwash** — "mouthwash"\n🛒 **How to order** — "order" or "buy"\n📦 **Delivery** — "delivery"\n💰 **Prices** — "price" or "how much"\n\nOr just describe your problem — I\'ll find the best match! 💪',
      ru: 'Интересный вопрос! 🤔 Вот чем я могу помочь:\n\n🦷 **Отбеливание** — напишите «отбеливание» или «белые зубы»\n💎 **Чувствительные зубы** — «чувствительные» или «болят зубы»\n👶 **Для детей** — «для детей» или «для ребёнка»\n🌿 **Натуральное** — «натуральная» или «веган»\n💉 **Проблемы с дёснами** — «дёсны» или «кровоточат»\n👑 **Премиум** — «премиум» или «подарок»\n🤰 **Для беременных** — «беременность» или «для мамы»\n🪥 **Щётки** — «щётка» или «brush»\n💧 **Ополаскиватель** — «ополаскиватель»\n🛒 **Как заказать** — «заказать» или «купить»\n📦 **Доставка** — «доставка»\n💰 **Цены** — «цена» или «сколько стоит»\n\nИли просто опишите вашу проблему — я подберу лучшее! 💪'
    };
    return responses[this.getLangKey()] || responses.uk;
  }

  async getResponse(userMessage: string): Promise<string> {
    const lowerMessage = userMessage.toLowerCase().trim();
    const langKey = this.getLangKey();

    // 1. Check conversational patterns first (greetings, help, ordering, etc.)
    for (const [, data] of Object.entries(conversationalPatterns)) {
      const matched = data.patterns.some(pattern => lowerMessage.includes(pattern));
      if (matched) {
        return data.response[langKey] || data.response.uk;
      }
    }

    // 2. Check product knowledge with scoring (find best match)
    let bestMatch: { category: string; score: number } | null = null;

    for (const [category, data] of Object.entries(productKnowledge)) {
      let score = 0;
      for (const keyword of data.keywords) {
        if (lowerMessage.includes(keyword.toLowerCase())) {
          score += keyword.length; // longer matches are worth more
        }
      }
      if (score > 0 && (!bestMatch || score > bestMatch.score)) {
        bestMatch = { category, score };
      }
    }

    if (bestMatch) {
      const data = productKnowledge[bestMatch.category];
      return data.recommendation[langKey] || data.recommendation.uk;
    }

    // 3. Default response with helpful menu
    return this.getDefaultResponse();
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
