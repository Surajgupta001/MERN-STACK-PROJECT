import express from "express";
import cors from "cors";
import "dotenv/config";
import ConnectDB from "./config/database.js";
import { clerkWebhooks, stripeWebhooks } from "./controllers/webhooks.js";
import educatorRouter from "./routes/educator.routes.js";
import { clerkMiddleware } from "@clerk/express";
import connectCloudinary from "./config/cloudinary.js";
import courseRouter from "./routes/course.routes.js";
import userRouter from "./routes/user.routes.js";

// Initialize Express app
const app = express();

// Database connection
await ConnectDB();

// Connect to Cloudinary
await connectCloudinary();

// Middleware
app.use(cors());

// JSON parsing for the rest of the app
app.use(express.json());

// Clerk middleware
app.use(clerkMiddleware());

// Default route
app.get("/", (req, res) => {
  res.send("LMS Backend is running");
});

// Import and use webhooks route
app.post("/clerk", clerkWebhooks);
app.use("/api/v1/educator", educatorRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/user", userRouter);
// Stripe webhook MUST come before express.json so raw body is available
app.post("/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

// Port configuration
const port = process.env.PORT || 5000;

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
