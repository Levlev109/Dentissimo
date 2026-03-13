// Cloudflare Pages Function — proxy for Nova Poshta API
// Avoids CORS issues when calling from browser

const NP_API = 'https://api.novaposhta.ua/v2.0/json/';

const ALLOWED_METHODS = new Set([
  'searchSettlements',
  'getWarehouses',
  'getSettlements',
  'getCities',
]);

const ALLOWED_MODELS = new Set([
  'Address',
  'AddressGeneral',
]);

export const onRequestPost: PagesFunction = async ({ request }) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const body = await request.json() as {
      modelName?: string;
      calledMethod?: string;
      methodProperties?: Record<string, unknown>;
    };

    // Validate model and method to prevent abuse
    if (!body.modelName || !ALLOWED_MODELS.has(body.modelName)) {
      return new Response(JSON.stringify({ success: false, errors: ['Invalid model'] }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    if (!body.calledMethod || !ALLOWED_METHODS.has(body.calledMethod)) {
      return new Response(JSON.stringify({ success: false, errors: ['Invalid method'] }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const npResponse = await fetch(NP_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey: '',
        modelName: body.modelName,
        calledMethod: body.calledMethod,
        methodProperties: body.methodProperties || {},
      }),
    });

    const data = await npResponse.text();

    return new Response(data, {
      status: npResponse.status,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch {
    return new Response(JSON.stringify({ success: false, errors: ['Proxy error'] }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
};
