import { Router } from "express";
import { protect } from "../middlewares/auth.js";
import { getProfile, updateProfile } from "../controllers/profile.controllers.js";

const profileRouter = Router();

profileRouter.get('/', protect, getProfile);
profileRouter.post('/', protect, updateProfile);

export default profileRouter;