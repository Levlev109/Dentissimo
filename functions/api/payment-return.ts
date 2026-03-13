// Cloudflare Pages Function — handles WayForPay redirect back after payment
// WayForPay sends POST to returnUrl, but Cloudflare Pages static hosting
// only serves GET. This function accepts the POST and redirects via 302 to
// the SPA checkout page so React can handle the payment result.

export const onRequestPost: PagesFunction = async (context) => {
  const url = new URL(context.request.url);

  // Read WayForPay POST body to extract payment status
  let paymentStatus = 'success';
  try {
    const formData = await context.request.formData();
    const reason = formData.get('reasonCode');
    const transactionStatus = formData.get('transactionStatus');

    if (transactionStatus === 'Declined' || transactionStatus === 'Expired' || reason === '1135') {
      paymentStatus = 'failed';
    }
  } catch {
    // If body parsing fails, default to success (user can verify in account)
  }

  // 302 redirect to SPA — browser will use GET
  const redirectUrl = `${url.origin}/checkout?payment=${paymentStatus}`;
  return Response.redirect(redirectUrl, 302);
};

// Also handle GET in case the browser retries or follows redirect
export const onRequestGet: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  return Response.redirect(`${url.origin}/checkout?payment=success`, 302);
};
