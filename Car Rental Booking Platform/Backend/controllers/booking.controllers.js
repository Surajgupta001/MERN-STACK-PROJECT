import Booking from "../models/booking.models.js";
import Car from "../models/car.models.js";

// Function to check Availability of car for a given date
const checkAvailability = async (req, res) => {
    const bookings = await Booking.find({
        car,
        pickupDate: { $lte: returnDate },
        returnDate: { $gte: pickupDate },
    });

    return bookings.length === 0;
};

// API to check availability of cars for the given date and location
export const checkAvailabilityOfCars = async (req, res) => {
    try {
        const { carId, pickupDate, returnDate } = req.body;

        // Fetch all available cars for the given location
        const cars = await Car.find({location, isAvailable: true});

        // Check availability for the given date range using promise
        const availableCarspromise = cars.map(async (car) => {
            const isAvailable = await checkAvailability(car._id, pickupDate, returnDate);
            return { ...car._doc, isAvailable: isAvailable };
        });

        let availableCars = await Promise.all(availableCarspromise);
        availableCars = availableCars.filter(car => car.isAvailable === true);

        res
        .status(200)
        .json({
            success: true,
            message: 'Available cars fetched successfully',
            availableCars
        });

    } catch (error) {
        console.error('Check Availability Error:', error);
        return res
        .status(500)
        .json({
            success: false,
            message: 'Error fetching available cars',
            error: error.message
        });
    }
};

// API to create booking
export const createBooking = async (req, res) => {
    try {
        const { _id } = req.user;
        const { car, pickupDate, returnDate } = req.body;

        const isAvailable = await checkAvailability(car, pickupDate, returnDate);

        if(!isAvailable){
            return res
            .status(400)
            .json({
                success: false,
                message: 'Car is not available for the selected dates'
            })
        }

        const carData = await Car.findById(car);

        // Calculate price based on pickupDate and returnDate
        const picked = new Date(pickupDate);
        const returned = new Date(returnDate);
        const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24));
        const price = noOfDays * carData.rentPerDay;

        await Booking.create({
            car,
            user: _id,
            owner: carData.owner,
            pickupDate,
            returnDate,
            price
        });

        return res
        .status(201)
        .json({
            success: true,
            message: 'Booking created successfully'
        })

    } catch (error) {
        console.error('Create Booking Error:', error);
        return res
        .status(500)
        .json({
            success: false,
            message: 'Error creating booking',
            error: error.message
        });
    }
};

// API to list User Bookings
export const getUserBookings = async (req, res) => {
    try {
        const { _id } = req.user;
        const bookings = await Booking.find({ user: _id }).populate('car').sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            message: 'User bookings fetched successfully',
            bookings
        });
    } catch (error) {
        console.error('Get User Bookings Error:', error);
        return res
        .status(500)
        .json({
            success: false,
            message: 'Error fetching user bookings',
            error: error.message
        })
    }  
};

// API to get Owner Bookings
export const getOwnerBookings = async (req, res) => {
    try {
        if(req.user.role !== 'owner'){
            return res
            .status(403)
            .json({
                success: false,
                message: 'Access denied. Owners only resource.'
            })
        }

        const bookings = await Booking.find({ owner: req.user._id }).populate('car user').select('-user.password').sort({ createdAt: -1 });

        return res
        .status(200)
        .json({
            success: true,
            message: 'Owner bookings fetched successfully',
            bookings
        });

    } catch (error) {
        console.error('Get Owner Bookings Error:', error);
        return res
        .status(500)
        .json({
            success: false,
            message: 'Error fetching owner bookings',
            error: error.message
        });
    }
};

// Api to change booking status
export const changeBookingStatus = async (req, res) => {
    try {
        const { _id } = req.user;
        const { bookingId, status } = req.body;

        const booking = await Booking.findById(bookingId);

        if(booking.owner.toString() !== _id.toString()){
            return res
            .status(403)
            .json({
                success: false,
                message: 'You are not authorized to change this booking'
            });
        }

        booking.status = status;
        await booking.save();

        return res
        .status(200)
        .json({
            success: true,
            message: 'Booking status updated successfully',
            booking
        });

    } catch (error) {
        console.error('Change Booking Status Error:', error);
        return res
        .status(500)
        .json({
            success: false,
            message: 'Error updating booking status',
        });
    }
};