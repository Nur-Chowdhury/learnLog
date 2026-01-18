import stripe from "../configs/stripe.js";
import Subscription from "../models/Subscription.js";

export const stripeWebhook = async (req, res) => {
    const signature = req.headers["stripe-signature"];

    let event;
    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );

        if (event.type === "checkout.session.completed") {
            const session = event.data.object;
            const { userId, plan } = session.metadata;

            let expiresAt = new Date();
            if (plan === "monthly") {
                expiresAt.setMonth(expiresAt.getMonth() + 1);
            } else {
                expiresAt.setFullYear(expiresAt.getFullYear() + 1);
            }

            await Subscription.create({
                user: userId,
                plan,
                price: session.amount_total / 100,
                expiresAt
            });
        }
        res.json({ received: true });
    } catch (error) {
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }
};
