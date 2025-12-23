app.get("/create-checkout-session", async (req, res) => {
  try {
    const { priceId } = req.query;

    if (!priceId) {
      return res.status(400).send("Missing priceId");
    }

    // Detect if price is recurring or one-time
    const price = await stripe.prices.retrieve(priceId);

    const session = await stripe.checkout.sessions.create({
      mode: price.recurring ? "subscription" : "payment",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: "https://sklzlabs.com/success",
      cancel_url: "https://sklzlabs.com/cancel",
    });

    res.redirect(303, session.url);
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    res.status(500).send("Checkout error");
  }
});
