import express from "express";
import cors from "cors";
import 'dotenv/config';
import { clerkMiddleware, requireAuth } from '@clerk/express'
import aiRouter from "./routes/ai.routes.js";
import connectCloudinary from "./config/cloudinary.js";

const app = express();

await connectCloudinary();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.get("/", (req, res) => {
    res.send("API is running...");
});

app.use(requireAuth());

app.use("/api/ai", aiRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});