// Fetch price details from Stripe
const price = await stripe.prices.retrieve(priceId);

// Decide checkout mode based on price type
const mode = price.type === 'recurring' ? 'subscription' : 'payment';

const session = await stripe.checkout.sessions.create({
  mode,
  payment_method_types: ['card'],
  line_items: [
    {
      price: priceId,
      quantity: 1,
    },
  ],
  success_url: SUCCESS_URL,
  cancel_url: CANCEL_URL,
});
