// Cloudflare Pages Function — handles WayForPay POST redirect to /checkout
// WayForPay may POST to /checkout?payment=success (old returnUrl).
// This catches that POST and converts it to a GET redirect so the SPA loads.

export const onRequestPost: PagesFunction = async (context) => {
  const url = new URL(context.request.url);

  // Check if WayForPay sent transaction status in form data
  let paymentStatus = url.searchParams.get('payment') || 'success';
  try {
    const formData = await context.request.formData();
    const transactionStatus = formData.get('transactionStatus');
    if (transactionStatus === 'Declined' || transactionStatus === 'Expired') {
      paymentStatus = 'failed';
    }
  } catch {
    // If form data can't be parsed, keep status from URL params
  }

  // 302 redirect — browser will follow with GET
  return Response.redirect(`${url.origin}/checkout?payment=${paymentStatus}`, 302);
};

// GET requests pass through to static assets (SPA index.html)
export const onRequestGet: PagesFunction = async (context) => {
  return context.next();
};
