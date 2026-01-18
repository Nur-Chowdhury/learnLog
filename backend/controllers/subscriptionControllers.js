import stripe from "../configs/stripe.js";
import Subscription from "../models/Subscription.js";


export const startSubscription = async (req, res) => {
    try {
        const { plan } = req.body;

        if (!["monthly", "yearly"].includes(plan)) {
            return res.status(400).json({ message: "Invalid plan" });
        }

        const existing = await Subscription.findOne({
            user: req.user.id,
            status: "active",
            expiresAt: { $gt: new Date() }
        });

        if (existing) {
            return res.status(400).json({message: "You already have an active subscription"});
        }

        const amount = plan === "monthly" ? 100 * 100 : 600 * 100;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: [
                {
                    price_data: {
                        currency: "bdt",
                        product_data: {
                            name: `${plan.toUpperCase()} Subscription`
                        },
                        unit_amount: amount
                    },
                    quantity: 1
                }
            ],
            success_url: "http://localhost:5174/api/subscriptions/payment-success",
            cancel_url: "http://localhost:5174/api/subscriptions/payment-cancelled",
            metadata: {
                userId: req.user.id,
                plan
            }
        });

        res.status(200).json({
            checkoutUrl: session.url,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Subscription checkout failed" });
    }
};


export const getMySubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findOne({
            user: req.user.id,
            status: "active",
            expiresAt: { $gt: new Date() }
        });

        if (!subscription) {
            return res.status(404).json({message: "No active subscription"});
        }
        res.json(subscription);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export const cancelSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findOne({
            user: req.user.id,
            status: "active"
        });

        if (!subscription) {
            return res.status(404).json({
                message: "No active subscription found"
            });
        }

        subscription.status = "cancelled";
        await subscription.save();

        res.json({ message: "Subscription cancelled successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


export const successPayment = async (req, res) => {
    res.json({ message: "Payment was successful! Your subscription is now active." });
};

export const cancelledPayment = async (req, res) => {
    res.json({ message: "Payment was cancelled. You can try subscribing again." });
};