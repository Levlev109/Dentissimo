// Cloudflare Pages Function — handles WayForPay server-to-server callback (serviceUrl)
// WayForPay sends POST with payment result. We must respond with a specific JSON
// to acknowledge receipt, otherwise WayForPay will keep retrying.

interface Env {
  WAYFORPAY_SECRET: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const CORS_HEADERS = {
    'Content-Type': 'application/json',
  };

  try {
    const body = await context.request.json() as Record<string, unknown>;
    const orderReference = String(body.orderReference || '');
    const status = String(body.transactionStatus || '');

    // Log for debugging (visible in Cloudflare dashboard)
    console.log(`[payment-callback] order=${orderReference} status=${status}`);

    // WayForPay requires this exact response format to stop retrying
    const time = Math.floor(Date.now() / 1000);
    return new Response(JSON.stringify({
      orderReference,
      status: 'accept',
      time,
    }), {
      status: 200,
      headers: CORS_HEADERS,
    });
  } catch {
    return new Response(JSON.stringify({ status: 'accept', time: Math.floor(Date.now() / 1000) }), {
      status: 200,
      headers: CORS_HEADERS,
    });
  }
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
