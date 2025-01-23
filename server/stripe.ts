import express, { type Express } from "express";
import Stripe from "stripe";
import { db } from "@db";
import { users } from "@db/schema";
import { eq } from "drizzle-orm";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

const PREMIUM_PRICE_ID = process.env.STRIPE_PRICE_ID || "price_H5ggYwtDq4fbrJ";

export async function setupStripe(app: Express) {
  app.post("/api/create-subscription", async (req, res) => {
    if (!req.user) {
      return res.status(401).send("Not authenticated");
    }

    try {
      // Create a Stripe customer
      const customer = await stripe.customers.create({
        email: req.user.username, // Using username as email for demo
        metadata: {
          userId: req.user.id.toString(),
        },
      });

      // Create a subscription
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: PREMIUM_PRICE_ID }],
        payment_behavior: "default_incomplete",
        expand: ["latest_invoice.payment_intent"],
        metadata: {
          userId: req.user.id.toString(),
        },
      });

      const invoice = subscription.latest_invoice as Stripe.Invoice;
      const payment_intent = invoice.payment_intent as Stripe.PaymentIntent;

      res.json({
        subscriptionId: subscription.id,
        clientSecret: payment_intent.client_secret,
      });
    } catch (error: any) {
      console.error("Subscription creation failed:", error);
      res.status(500).send(error.message || "Failed to create subscription");
    }
  });

  app.post("/api/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig || !endpointSecret) {
      return res.status(400).send("Missing signature or webhook secret");
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        endpointSecret
      );
    } catch (err: any) {
      console.error("Webhook Error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle subscription lifecycle events
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = parseInt(subscription.metadata.userId);
        const status = subscription.status === "active";

        await db
          .update(users)
          .set({ isSubscribed: status })
          .where(eq(users.id, userId));
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = parseInt(subscription.metadata.userId);

        await db
          .update(users)
          .set({ isSubscribed: false })
          .where(eq(users.id, userId));
        break;
      }
    }

    res.json({ received: true });
  });
}