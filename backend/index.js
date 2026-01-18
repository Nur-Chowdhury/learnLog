import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import connectDB from "./configs/db.js";
import setupSwagger from "./configs/swagger.js";
import authRoutes from "./routes/authRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";
import subcriptionRoutes from "./routes/subscriptionRoutes.js";
import ratingRoutes from "./routes/ratingRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { stripeWebhook } from "./controllers/stripeWebhookController.js";

connectDB();

const app = express();

setupSwagger(app);

app.post(
    "/api/webhooks/stripe",
    express.raw({ type: "application/json" }),
    stripeWebhook
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/contents", contentRoutes);
app.use("/api/subscriptions", subcriptionRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5174;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})