// WayForPay payment integration (client-side widget)
// Signature is generated server-side via Cloudflare Pages Function

const MERCHANT_ACCOUNT = 'dentissimo_sale';
const MERCHANT_DOMAIN  = 'dentissimo.sale';

export interface PaymentItem {
  name: string;
  price: number;
  count: number;
}

export interface PaymentParams {
  orderId: string;
  amount: number;
  items: PaymentItem[];
  clientName: string;
  clientEmail: string;
  clientPhone: string;
}

declare global {
  interface Window {
    Wayforpay: new () => {
      run(
        params: Record<string, unknown>,
        onApproved?: (response: unknown) => void,
        onDeclined?: (response: unknown) => void,
        onPending?: (response: unknown) => void
      ): void;
    };
  }
}

export async function openPayment(params: PaymentParams): Promise<'approved' | 'declined' | 'pending'> {
  const orderDate = Math.floor(Date.now() / 1000);

  const productNames = params.items.map(i => i.name);
  const productCounts = params.items.map(i => i.count);
  const productPrices = params.items.map(i => i.price);

  // Fetch with 15-second timeout
  const controller = new AbortController();
  const fetchTimer = setTimeout(() => controller.abort(), 15_000);

  let sigResponse: Response;
  try {
    sigResponse = await fetch('/api/payment-signature', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        orderId: params.orderId,
        orderDate,
        amount: params.amount,
        productNames,
        productCounts,
        productPrices,
      }),
    });
  } catch (err) {
    clearTimeout(fetchTimer);
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('Сервер не відповідає. Спробуйте пізніше.');
    }
    throw new Error('Не вдалося з\'єднатися з сервером оплати.');
  }
  clearTimeout(fetchTimer);

  if (!sigResponse.ok) {
    throw new Error('Помилка генерації підпису оплати.');
  }

  const contentType = sigResponse.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error('Сервер оплати повернув невірну відповідь. Зверніться до підтримки.');
  }

  const { merchantSignature } = await sigResponse.json();

  // Widget with 3-minute timeout (user may close popup → Promise never resolves)
  return new Promise((resolve, reject) => {
    if (!window.Wayforpay) {
      reject(new Error('Скрипт WayForPay не завантажено. Оновіть сторінку.'));
      return;
    }

    const widgetTimer = setTimeout(() => {
      reject(new Error('Час очікування оплати вичерпано.'));
    }, 180_000);

    const wayforpay = new window.Wayforpay();
    wayforpay.run(
      {
        merchantAccount: MERCHANT_ACCOUNT,
        merchantDomainName: MERCHANT_DOMAIN,
        merchantSignature,
        orderReference: params.orderId,
        orderDate,
        amount: params.amount,
        currency: 'UAH',
        productName: productNames,
        productPrice: productPrices,
        productCount: productCounts,
        clientFirstName: params.clientName.split(' ')[0] || '',
        clientLastName: params.clientName.split(' ').slice(1).join(' ') || '',
        clientEmail: params.clientEmail,
        clientPhone: params.clientPhone,
        language: 'UA',
        returnUrl: 'https://dentissimo.sale/',
        serviceUrl: 'https://dentissimo.sale/',
      },
      () => { clearTimeout(widgetTimer); resolve('approved'); },
      () => { clearTimeout(widgetTimer); resolve('declined'); },
      () => { clearTimeout(widgetTimer); resolve('pending'); },
    );
  });
}
