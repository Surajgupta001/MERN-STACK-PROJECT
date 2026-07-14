import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware.js";
import RestaurantModel from "../models/restaurant.models.js";
import { uploadToCloudinary } from "../../utils/utils.js";
import BookingModel from "../models/booking.models.js";

// Get Owner Restaurants
// GET /api/v1/owner/restaurants
export const getOwnerRestaurants = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const restaurant = await RestaurantModel.findOne({ owner: req.user?._id });

        res
            .status(200)
            .json({
                success: true,
                message: 'Owner restaurant fetched successfully',
                restaurant
            });

    } catch (error: any) {
        console.error('Error fetching owner restaurant:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// Create owner's restaurant (submitted to pending)
// POST /api/v1/owner/restaurants
export const createOwnerRestaurant = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const existing = await RestaurantModel.findOne({ owner: req.user?._id });

        if (existing) {
            res
                .status(400)
                .json({
                    success: false,
                    message: 'You have already created a restaurant'
                });
            return;
        }

        // Continue with restaurant creation logic
        const { name, description, cuisine, priceRange, location, address, chef, tags, availableSlots, totalSeats } = req.body;

        if (!name || !description || !cuisine || !priceRange || !location || !address || !chef) {
            res
                .status(400)
                .json({
                    success: false,
                    message: 'Please provide all required fields'
                });
            return;
        }

        // Generate a unique slug for the restaurant
        const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');

        // check if the slug already exists
        const existingSlug = await RestaurantModel.findOne({ slug });

        if (existingSlug) {
            res
                .status(400)
                .json({
                    success: false,
                    message: 'A restaurant with this name already exists'
                });
            return;
        }

        // Handle image upload if provided
        let imageUrl = '';
        if (req.file) {
            // handle Image upload logic here, e.g., using a cloud service like Cloudinary
            const result = await uploadToCloudinary(req.file.buffer);
            imageUrl = result.secure_url;
        }

        // Setup parsed tags and slots
        const parsedTags = typeof tags === 'string' ? tags.split(',').map((tag: string) => tag.trim()) : tags || [];
        const parsedSlots = typeof availableSlots === 'string' ? availableSlots.split(',').map((slot: string) => slot.trim()) : availableSlots || ['17:00', '18:00', '19:00', '20:00', '21:00'];

        const newRestaurant = new RestaurantModel({
            name,
            slug,
            description,
            cuisine,
            priceRange,
            location,
            address,
            chef,
            image: imageUrl,
            tags: parsedTags,
            availableSlots: parsedSlots,
            totalSeats: totalSeats ? Number(totalSeats) : 20, // Default to 20 if not provided
            owner: req.user?._id,
            status: 'pending' // Set initial status to pending
        });

        await newRestaurant.save();

        res
            .status(201)
            .json({
                success: true,
                message: 'Restaurant created successfully and is pending approval',
                newRestaurant
            });

    } catch (error: any) {
        console.error('Error creating owner restaurant:', error);
        res
            .status(500)
            .json({
                success: false,
                message: error.message || 'Server Error'
            });
    }
};

// Update owner's restaurant
// PUT /api/v1/owner/restaurants/:id
export const updateOwnerRestaurant = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const restaurant = await RestaurantModel.findOne({ owner: req.user?._id });

        if (!restaurant) {
            res
                .status(404)
                .json({
                    success: false,
                    message: 'Restaurant not found for this owner'
                });
            return;
        }

        // Update restaurant fields
        const { name, description, cuisine, priceRange, location, address, chef, tags, availableSlots, totalSeats } = req.body;

        if (name) restaurant.name = name;
        if (description) restaurant.description = description;
        if (cuisine) restaurant.cuisine = cuisine;
        if (priceRange) restaurant.priceRange = priceRange;
        if (location) restaurant.location = location;
        if (address) restaurant.address = address;
        if (chef) restaurant.chef = chef;
        if (totalSeats) restaurant.totalSeats = Number(totalSeats);

        if (tags) {
            restaurant.tags = typeof tags === 'string' ? tags.split(',').map((tag: string) => tag.trim()) : tags;
        }

        if (availableSlots) {
            restaurant.availableSlots = typeof availableSlots === 'string' ? availableSlots.split(',').map((slot: string) => slot.trim()) : availableSlots;
        }

        // handle new image upload if provided
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer);
            restaurant.image = result.secure_url;
        }

        const updated = await restaurant.save();

        res
            .status(200)
            .json({
                success: true,
                message: 'Restaurant updated successfully',
                updated
            });

    } catch (error: any) {
        console.error('Error updating owner restaurant:', error);
        res
            .status(500)
            .json({
                success: false,
                message: error.message || 'Server Error'
            });
    }
};

// Get Booking for Owner's Restaurant
// GET /api/v1/owner/bookings
export const getOwnerBookings = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const restaurant = await RestaurantModel.findOne({ owner: req.user?._id });

        if (!restaurant) {
            res
                .status(404)
                .json({
                    success: false,
                    message: 'No restaurant found for this owner'
                });
            return;
        }

        const bookings = await BookingModel.find({ restaurant: restaurant._id }).populate('user', 'name email phone').sort({ date: -1, time: -1 });

        res
            .status(200)
            .json({
                success: true,
                bookings
            });
    } catch (error: any) {
        console.error('Error fetching owner bookings:', error);
        res
            .status(500)
            .json({
                success: false,
                message: error.message || 'Server Error'
            });
    }
};

// Update status of a booking
// PUT /api/v1/owner/bookings/:id/status
export const updateBookingStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { status } = req.body;

        if (!status || !['confirmed', 'cancelled', 'completed'].includes(status)) {
            res
                .status(400)
                .json({
                    success: false,
                    message: 'Invalid status value. Must be one of: confirmed, cancelled, completed'
                });
            return;
        }

        const booking = await BookingModel.findById(req.params.id);

        if (!booking) {
            res
                .status(404)
                .json({
                    success: false,
                    message: 'Booking not found'
                });
            return;
        }

        // verify that the booking belongs to the owner's restaurant
        const restaurant = await RestaurantModel.findById(booking.restaurant);

        if (!restaurant || restaurant.owner.toString() !== req.user?._id.toString()) {
            res
                .status(403)
                .json({
                    success: false,
                    message: 'You are not the owner of this restaurant'
                });
            return;
        }

        booking.status = status;
        await booking.save();

        res
            .status(200)
            .json({
                success: true,
                message: 'Booking status updated successfully',
                booking
            });
    } catch (error: any) {
        console.error('Error updating owner booking status:', error);
        res
            .status(500)
            .json({
                success: false,
                message: error.message || 'Server Error'
            });
    }
};