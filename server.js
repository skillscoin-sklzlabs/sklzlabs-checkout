// Fetch price details from Stripe
const price = await stripe.prices.retrieve(priceId);

// Decide checkout mode
const isRecurring = price.type === 'recurring';

const session = await stripe.checkout.sessions.create({
  mode: isRecurring ? 'subscription' : 'payment',

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
