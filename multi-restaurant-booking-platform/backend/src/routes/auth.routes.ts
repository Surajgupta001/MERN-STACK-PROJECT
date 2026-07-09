import { Router } from "express";
import { getMe, loginUser, registerUser } from "../controllers/auth.controllers.js";

const authRouter = Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.get('/me', getMe);

export default authRouter;