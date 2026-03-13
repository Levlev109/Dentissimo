// WayForPay payment integration — redirect-based (form POST to WayForPay)
// Signature is generated server-side via Cloudflare Pages Function

const MERCHANT_ACCOUNT = 'dentissimo_sale';
const MERCHANT_DOMAIN  = 'dentissimo.sale';
const WAYFORPAY_URL    = 'https://secure.wayforpay.com/pay';

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

export async function openPayment(params: PaymentParams): Promise<void> {
  const orderDate = Math.floor(Date.now() / 1000);

  const productNames = params.items.map(i => i.name);
  const productCounts = params.items.map(i => i.count);
  const productPrices = params.items.map(i => i.price);

  // Fetch signature with 15-second timeout
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

  // Build and submit a hidden form to WayForPay (redirect-based payment)
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = WAYFORPAY_URL;
  form.style.display = 'none';

  const fields: Record<string, string | string[]> = {
    merchantAccount: MERCHANT_ACCOUNT,
    merchantDomainName: MERCHANT_DOMAIN,
    merchantSignature,
    orderReference: params.orderId,
    orderDate: String(orderDate),
    amount: String(params.amount),
    currency: 'UAH',
    productName: productNames,
    productPrice: productPrices.map(String),
    productCount: productCounts.map(String),
    clientFirstName: params.clientName.split(' ')[0] || '',
    clientLastName: params.clientName.split(' ').slice(1).join(' ') || '',
    clientEmail: params.clientEmail,
    clientPhone: params.clientPhone,
    language: 'UA',
    returnUrl: 'https://dentissimo.sale/api/payment-return',
    serviceUrl: 'https://dentissimo.sale/api/payment-callback',
  };

  for (const [key, value] of Object.entries(fields)) {
    if (Array.isArray(value)) {
      for (const v of value) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = `${key}[]`;
        input.value = v;
        form.appendChild(input);
      }
    } else {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    }
  }

  document.body.appendChild(form);
  form.submit();
}
