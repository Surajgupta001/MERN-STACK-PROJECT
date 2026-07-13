import { Router } from "express";
import { adminOnly, protect } from "../middlewares/auth.middleware.js";
import { approveRestaurant, getAllRestaurants, getAdminStats } from "../controllers/admin.controllers.js";

const adminRouter = Router();

adminRouter.use(protect);
adminRouter.use(adminOnly);

adminRouter.get("/restaurants", getAllRestaurants);
adminRouter.get("/restaurants/:id/approve", approveRestaurant);
adminRouter.get("/stats", getAdminStats);

export default adminRouter;