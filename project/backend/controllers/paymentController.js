import Stripe from "stripe";

export const createPaymentIntent = async (req, res) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const { amount } = req.body;

    if (!amount || amount < 5) {
      return res.status(400).json({ message: "Minimum investment is 5 USD" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ message: "Payment failed" });
  }
};
