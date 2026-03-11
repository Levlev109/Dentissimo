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

  // Get signature from server-side API (secret key never reaches the browser)
  const sigResponse = await fetch('/api/payment-signature', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      orderId: params.orderId,
      orderDate,
      amount: params.amount,
      productNames,
      productCounts,
      productPrices,
    }),
  });

  if (!sigResponse.ok) {
    throw new Error('Failed to generate payment signature');
  }

  const { merchantSignature } = await sigResponse.json();

  return new Promise((resolve, reject) => {
    if (!window.Wayforpay) {
      reject(new Error('WayForPay script not loaded'));
      return;
    }

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
      () => resolve('approved'),
      () => resolve('declined'),
      () => resolve('pending'),
    );
  });
}
