import Subscription from "../models/Subscription.js";

export const hasActiveSubscription = async (userId) => {
    const subscription = await Subscription.findOne({
        user: userId,
        status: "active"
    });

    if (!subscription) {
        return false;
    }

    if (subscription.expiresAt <= new Date()) {
        subscription.status = "expired";
        await subscription.save();
        return false;
    }

    return true;
};
