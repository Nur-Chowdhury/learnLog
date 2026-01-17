import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        plan: {
            type: String,
            enum: ["monthly", "yearly"],
            required: true
        },

        price: {
            type: Number,
            required: true
        },

        status: {
            type: String,
            enum: ["active", "expired", "cancelled"],
            default: "active"
        },

        startedAt: {
            type: Date,
            default: Date.now
        },

        expiresAt: {
            type: Date,
            required: true
        }
    },
    { timestamps: true }
);

export default mongoose.model("Subscription", subscriptionSchema);
