import express from "express";
import Stripe from "stripe";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 10000;

// Stripe init (SECRET KEY FROM RENDER ENV)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("SKLZ Checkout API is running");
});

/**
 * CREATE CHECKOUT SESSION
 * Works for:
 * - Subscriptions (monthly / yearly)
 * - One-time payments (lifetime)
 */
app.get("/create-checkout-session", async (req, res) => {
  try {
    const priceId = req.query.priceId;

    if (!priceId) {
      return res.status(400).send("Missing priceId");
    }

    // Fetch price from Stripe
    const price = await stripe.prices.retrieve(priceId);

    // Decide checkout mode
    const mode = price.recurring ? "subscription" : "payment";

    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: "https://skzlabs.com/success",
      cancel_url: "https://skzlabs.com/cancel",
    });

    // Redirect user to Stripe Checkout
    res.redirect(303, session.url);
  } catch (err) {
    console.error("Stripe error:", err.message);
    res.status(500).send("Checkout error");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
