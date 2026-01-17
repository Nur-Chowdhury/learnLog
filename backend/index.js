import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./configs/db.js";
import setupSwagger from "./configs/swagger.js";
import authRoutes from "./routes/authRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";

dotenv.config();
connectDB();

const app = express();

setupSwagger(app);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/contents", contentRoutes);

const PORT = process.env.PORT || 5174;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})