import express from "express";
import dotenv from "dotenv";
import connectDB from "./configs/db.js";
import setupSwagger from "./configs/swagger.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
connectDB();

const app = express();

setupSwagger(app);

app.use(express.json());

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5174;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})