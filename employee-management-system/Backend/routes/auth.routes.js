import { Router } from "express";
import { changePassword, getSession, login } from "../controllers/auth.controllers.js";
import { protect } from "../middlewares/auth.js";

const authRouter = Router();

authRouter.post("/login", login);
authRouter.get("/session", protect, getSession);
authRouter.post("/change-password", protect, changePassword);

export default authRouter;