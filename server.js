import express from "express";
import Stripe from "stripe";
import cors from "cors";

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("SKLZ Checkout API is running");
});

// ✅ MAIN CHECKOUT ROUTE (THIS IS THE IMPORTANT ONE)
app.get("/create-checkout-session", async (req, res) => {
  try {
    const { priceId } = req.query;

    if (!priceId) {
      return res.status(400).send("Missing priceId");
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription", // OK for monthly & yearly
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: "https://sklzlabs.com/success",
      cancel_url: "https://sklzlabs.com/cancel",
    });

    // 🔁 Redirect user to Stripe Checkout
    res.redirect(303, session.url);

  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).send("Checkout error");
  }
});

// Start server (Render handles PORT)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
