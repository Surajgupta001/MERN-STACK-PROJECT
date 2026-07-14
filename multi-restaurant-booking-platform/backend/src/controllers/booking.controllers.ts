import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware.js";
import RestaurantModel from "../models/restaurant.models.js";
import BookingModel from "../models/booking.models.js";

// Create a new booking
// POST /api/v1/bookings
// @acess Private
export const createBooking = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { restaurantId, date, time, guests, occasion, specialRequests } = req.body;

        if (!restaurantId || !date || !time || !guests) {
            res
                .status(400)
                .json({
                    success: false,
                    message: 'Missing required fields: restaurantId, date, time, guests'
                });
            return;
        }

        // Check if restaurant exists
        const restaurant = await RestaurantModel.findById(restaurantId);
        if (!restaurant) {
            res
                .status(404)
                .json({
                    success: false,
                    message: 'Restaurant not found'
                });
            return;
        }

        // Verify restaurant is aproved
        if (restaurant.status !== 'approved') {
            res
                .status(403)
                .json({
                    success: false,
                    message: 'Restaurant is not approved for bookings'
                });
            return;
        }

        //Verify seat availability
        const requestedGuests = Number(guests);

        const existingBookings = await BookingModel.find({
            restaurant: restaurantId,
            date: new Date(date),
            time,
            status: 'confirmed'
        });

        const bookedSeates = existingBookings.reduce((total, booking) => total + booking.guests, 0);
        const totalSeats = restaurant.totalSeats || 20;

        const availableSeats = totalSeats - bookedSeates;

        if (requestedGuests > availableSeats) {
            res
                .status(400)
                .json({
                    success: false,
                    message: `Not enough available seats. Requested: ${requestedGuests}, Available: ${availableSeats}`
                });
            return;
        }
        
        // Create booking
        const booking = new BookingModel({
            user: req.user?._id,
            restaurant: restaurantId,
            date: new Date(date),
            time,
            guests: Number(guests),
            occasion,
            specialRequests,
            status: 'confirmed',
        });

        await booking.save();

        // Poplate restaurant info before returning the response
        const populationBooking = await booking.populate('restaurant', 'name location image address');
        
        res
        .status(201)
        .json({
            success: true,
            populationBooking
        });
        
    } catch (error: any) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get logged in user bookings
// GET /api/v1/bookings/my
// @acess Private
export const getMyBookings = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const bookings = await BookingModel.find({
            user: req.user?._id
        }).populate('restaurant', 'name location image address slug').sort({ date: -1, time: -1 });
        
        res
        .status(200)
        .json({
            success: true,
            bookings
        });

    } catch (error: any) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Cancel a booking
// PUT /api/v1/bookings/:id/cancel
// @acess Private
export const cancelBooking = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const booking = await BookingModel.findById(req.params.id);
        if (!booking) {
            res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
            return;
        }

        // Verify user ownership of the booking
        if (booking.user.toString() !== req.user?._id.toString()) {
            res
            .status(403)
            .json({
                success: false,
                message: 'You are not the owner of this booking'
            });
            return;
        }

        booking.status = 'cancelled';
        await booking.save();

        const populatedBooking = await booking.populate('restaurant', 'name location image address');

        res
        .status(200)
        .json({
            success: true,
            message: 'Booking cancelled successfully',
            populatedBooking
        });
        
    } catch (error: any) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};