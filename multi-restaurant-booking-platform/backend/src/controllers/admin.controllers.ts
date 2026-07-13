import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware.js";
import RestaurantModel from "../models/restaurant.models.js";
import UserModel from "../models/user.models.js";
import BookingModel from "../models/booking.models.js";

// Get all restaurants for admin management
// GET /api/v1/admin/restaurants
export const getAllRestaurants = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const restaurants = await RestaurantModel.find({}).populate("owner", "name email phone").sort({ createdAt: -1 });
        res
            .status(200)
            .json({
                success: true,
                restaurants
            });

    } catch (error: any) {
        console.error(error);
        res
            .status(500)
            .json({
                success: false,
                message: error.message
            });
    }
};

// Approve/reject a restaurant profile
// GET /api/v1/admin/restaurants/:id/approve
export const approveRestaurant = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { status } = req.body;
        if (!status || !["approved", "rejected", "pending"].includes(status)) {
            res
                .status(400)
                .json({
                    success: false,
                    message: "Invalid status value. Must be 'approved' or 'rejected' or 'pending'."
                });
            return;
        }

        const restaurant = await RestaurantModel.findByIdAndUpdate(req.params.id)
        if (!restaurant) {
            res
                .status(404)
                .json({
                    success: false,
                    message: "Restaurant not found."
                });
            return;
        }

        restaurant.status = status;
        await restaurant.save();
        res
            .status(200)
            .json({
                success: true,
                message: `Restaurant ${status} successfully.`,
                restaurant
            });

    } catch (error: any) {
        console.error(error);
        res
            .status(500)
            .json({
                success: false,
                message: error.message
            });
    }
};

// Get system ststistics
// GET /api/v1/admin/stats
export const getAdminStats = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const totalusers = await UserModel.countDocuments({ role: 'user' });
        const totalOwners = await UserModel.countDocuments({ role: 'owner' });
        const totalbookings = await BookingModel.countDocuments({});
        const totalrestaurants = await RestaurantModel.countDocuments({});

        // Get latest 10 bokkings
        const latestBookings = await BookingModel.find({})
            .populate("user", "name email")
            .populate("restaurant", "name")
            .sort({ createdAt: -1 })
            .limit(10);

        res
            .status(200)
            .json({
                success: true,
                users: {
                    totalusers,
                    totalOwners,
                    total: totalusers + totalOwners
                },
                restaurants: {
                    total: totalrestaurants
                },
                bookings: {
                    total: totalbookings,
                },
                latestBookings
            });
    } catch (error: any) {
        console.error(error);
        res
            .status(500)
            .json({
                success: false,
                message: error.message
            });
    }
};