import { Request, Response } from "express";
import RestaurantModel from "../models/restaurant.models.js";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.models.js";
import BookingModel from "../models/booking.models.js";

// Get all restaurants with search and filters
// Get /api/v1/restaurants
export const getRestaurants = async (req: Request, res: Response): Promise<void> => {
    try {

        // Destructure query parameters for search and filters
        const { search, priceRange, rating, location, sort } = req.query;

        // build query object
        const queryObj: any = { status: 'approved' };

        if (search) {
            queryObj.$or = [
                { name: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } }
            ]
        }

        if (priceRange) {
            const prices = Array.isArray(priceRange) ? priceRange : [priceRange];
            queryObj.priceRange = { $in: prices };
        }

        if (rating) {
            queryObj.rating = { $gte: parseFloat(rating as string) };
        }

        if (location) {
            queryObj.location = { $regex: location, $options: 'i' };
        }

        // Sorting logic
        let sortOptions: any = { createdAt: -1 }; // Default sorting by newest
        if (sort == 'rating') {
            sortOptions = { rating: -1 };
        } else if (sort == 'price_low') {
            sortOptions = { priceRange: 1 };
        } else if (sort == 'price_high') {
            sortOptions = { priceRange: -1 };
        }

        const restaurants = await RestaurantModel.find(queryObj).sort(sortOptions);
        
        res
            .status(200)
            .json({
                success: true,
                message: 'Restaurants fetched successfully',
                restaurants
            });

    } catch (error: any) {
        console.error('Error fetching restaurants:', error);
        res
            .status(500)
            .json({
                success: false,
                message: error.message || 'Server Error'
            });
    }
};

// Get features and exlusive restaurants
// Get /api/v1/restaurants/featured
export const getFeaturedRestaurants = async (req: Request, res: Response): Promise<void> => {
    try {
        const featured = await RestaurantModel.find({
            status: 'approved',
            $or: [
                { isFeatured: true },
                { isExclusive: true }
            ]
        }).limit(6);

        res
            .status(200)
            .json({
                success: true,
                message: 'Featured restaurants fetched successfully',
                featured
            });

    } catch (error: any) {
        console.error('Error fetching featured restaurants:', error);
        res
            .status(500)
            .json({
                success: false,
                message: error.message || 'Server Error'
            });
    }
};

// Get single restaurant by slug
// Get /api/v1/restaurants/:slug
export const getRestaurantBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
        const restaurant = await RestaurantModel.findOne({ slug: req.params.slug });
        
        if (!restaurant) {
            res
                .status(404)
                .json({
                    success: false,
                    message: 'Restaurant not found'
                });
            return;
        }

        // If not approved, verify if the user is the owner or admin
        if (restaurant.status !== 'approved') {
            let isAuthorized = false;
            
            // Check if the user is authenticated and has the right role
            if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
                try {
                    // Verify JWT token and check user role
                    const token = req.headers.authorization.split(' ')[1];
                    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
                    
                    // Check if the user is an admin or the owner of the restaurant
                    const user = await UserModel.findById(decoded.id);
                    if (user && (user.role === 'admin' || (user.role === 'owner' && restaurant.owner.toString() === user._id.toString()))) {
                        isAuthorized = true;
                    }
                } catch (error) {
                    // Ignore token verify error
                }
            }
            if (!isAuthorized) {
                res
                    .status(403)
                    .json({
                        success: false,
                        message: 'You are not authorized to view this restaurant'
                    });
                return;
            }
        }

        res
            .status(200)
            .json({
                success: true,
                message: 'Restaurant fetched successfully',
                restaurant
            });
    } catch (error: any) {
        console.error('Error fetching restaurant by slug:', error);
        res
            .status(500)
            .json({
                success: false,
                message: error.message || 'Server Error'
            });
    }
};

// Get dynamic seat availability for slots
// Get /api/v1/restaurants/:id/availability
export const getRestaurantAvailability = async (req: Request, res: Response): Promise<void> => {
    try {
        const { data } = req.query;
        if (!data) {
            res
                .status(400)
                .json({
                    success: false,
                    message: 'Missing required query parameter: data'
                });
            return;
        }

        const restaurant = await RestaurantModel.findById(req.params.id);
        if (!restaurant) {
            res
                .status(404)
                .json({
                    success: false,
                    message: 'Restaurant not found'
                });
            return;
        }

        const bookingDate = new Date(data as string);

        // Get all active booking on this date for the restaurant
        const bookings = await BookingModel.find({
            restaurant: restaurant._id,
            date: bookingDate,
            status: 'confirmed'
        });

        // Map slot to available capacities
        const availability = restaurant.availableSlots.map((slot) => {
            const bookedSeats = bookings.filter((b) => b.time === slot).reduce((sum ,b) => sum + b.guests, 0);

            const totalSeats = restaurant.totalSeats || 20;
            const availableSeats = Math.max(0, totalSeats - bookedSeats);

            return {
                time: slot,
                availableSeats,
                isAvailable: availableSeats > 0
            };

        })

        res
            .status(200)
            .json({
                success: true,
                message: 'Restaurant availability fetched successfully',
                availability
            });

    } catch (error: any) {
        console.error('Error fetching restaurant availability:', error);
        res
            .status(500)
            .json({
                success: false,
                message: error.message || 'Server Error'
            });
    }
};