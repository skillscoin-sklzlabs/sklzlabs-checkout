import express from "express";
import Stripe from "stripe";
import cors from "cors";

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// REQUIRED
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("SKLZ Checkout API is running");
});

// Main checkout route
app.post("/create-checkout-session", async (req, res) => {
  try {
    console.log("CHECKOUT HIT:", req.body);

    const { priceId } = req.body;
    if (!priceId) {
      return res.status(400).json({ error: "Missing priceId" });
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode:
        priceId === "price_1SgN3eF07IAsxK4LcLJ90hLf"
          ? "payment" // Lifetime
          : "subscription", // Monthly & Yearly
      success_url: "https://sklzlabs.com/success",
      cancel_url: "https://sklzlabs.com/cancel",
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("STRIPE ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Render port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
