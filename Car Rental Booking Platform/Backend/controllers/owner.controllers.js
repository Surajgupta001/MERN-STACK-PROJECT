import imagekit from "../config/imageKit.js";
import Booking from "../models/booking.models.js";
import Car from "../models/car.models.js";
import User from "../models/user.models.js";
import fs from "fs";

// Change User Role to Owner
export const changeRoleToOwner = async (req, res) => {
    try {
        const { _id } = req.user;
        await User.findByIdAndUpdate(_id, { role: 'owner' });

        return res
            .status(200)
            .json({
                success: true,
                message: 'User role updated to owner'
            });

    } catch (error) {
        console.error('Change Role Error:', error);
        return res
            .status(500)
            .json({
                success: false,
                message: 'Server error',
                error: error.message
            });
    }
};

// API to list car
export const addCar = async (req, res) => {
    try {
        const { _id } = req.user;
        if (!req.body?.carData) {
            return res
            .status(400)
            .json({ 
                success: false,
                message: 'carData is required (JSON string)' 
            });
        }

        let car;
        try {
            car = JSON.parse(req.body.carData);
        } catch (e) {
            return res
            .status(400)
            .json({ 
                success: false, 
                message: 'Invalid carData JSON' 
            });
        }
        const imageFile = req.file;
        if (!imageFile) {
            return res
            .status(400)
            .json({ 
                success: false, 
                message: 'Image file is required (field name: image)' 
            });
        }
        if (!imageFile.buffer && !imageFile.path) {
            return res
            .status(400)
            .json({ 
                success: false, 
                message: 'Uploaded file missing buffer/path' 
            });
        }

        // Upload image to ImageKit
        const fileBuffer = imageFile.buffer || fs.readFileSync(imageFile.path);
        const response = await imagekit.upload({
            file: fileBuffer, //required
            fileName: imageFile.originalname,   //required
            folder: "/car_images"
        });

        // Optimization through image URL transformation
        var optimisedImageUrl = imagekit.url({
            path: response.filePath,
            transformation: [
                { width: '1280' },
                { quality: 'auto' }, // Auto Compression
                { format: 'webp' } // Convert to modern format
            ]
        });

        const image = optimisedImageUrl;
        await Car.create({ ...car, owner: _id, image });

        return res
        .status(201)
        .json({
            success: true,
            message: 'Car added successfully'
        });

    } catch (error) {
        console.error('Add Car Error:', error);
        return res
            .status(500)
            .json({
                success: false,
                message: 'Server error',
                error: error.message
            });
    }
};

// API to get all cars of an owner
export const getOwnerCars = async (req, res) => {
    try {
        const { _id } = req.user;
        const cars = await Car.find({ owner: _id });
        return res
            .status(200)
            .json({
                success: true,
                cars
            });
    } catch (error) {
        console.error('Get Owner Cars Error:', error);
        return res
        .status(500)
        .json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// API to toggle car availability
export const toggleCarAvailability = async (req, res) => {
    try {
        const { _id } = req.user;
        const { carId } = req.body;
        const car = await Car.findById(carId);

        // Checking is car belong to the user
        if (car.owner.toString() !== _id.toString()){
            return res
            .status(403)
            .json({
                success: false,
                message: 'You are not authorized to update this car'
            });
        }

        car.isAvailable = !car.isAvailable;
        await car.save();

        return res
        .status(200)
        .json({
            success: true,
            message: 'Car availability updated',
        })

    } catch (error) {
        console.error('Toggle Car Availability Error:', error);
        return res
            .status(500)
            .json({
                success: false,
                message: 'Server error',
                error: error.message
            });
    }
};

// API to delete a car
export const deleteCar = async (req, res) => {
    try {
        const { _id } = req.user;
        const { carId } = req.body;
        const car = await Car.findById(carId);

        // Checking is car belong to the user
        if (car.owner.toString() !== _id.toString()){
            return res
            .status(403)
            .json({
                success: false,
                message: 'You are not authorized to delete this car'
            })
        }

        car.owner = null;
        car.isAvailable = false;
        await car.save();

        return res
            .status(200)
            .json({
                success: true,
                message: 'Car deleted successfully'
            });
    } catch (error) {
        console.error('Delete Car Error:', error);
        return res
            .status(500)
            .json({
                success: false,
                message: 'Server error',
                error: error.message
            });
    }
};

// API to get Dashboard data
export const getDashboardData = async (req, res) => {
    try {
        const { _id, role } = req.user;
        if(role !== 'owner'){
            return res
            .status(403)
            .json({
                success: false,
                message: 'Access denied'
            });
        }

        // Data gathering (runs only when owner)
        const cars = await Car.find({ owner: _id });
        const bookings = await Booking.find({ owner: _id }).populate('car').sort({ createdAt: -1 });

        const pendingCount = bookings.filter(b => b.status === 'pending').length;
        const completedCount = bookings.filter(b => b.status === 'confirmed').length;
        // Sum confirmed booking prices (model uses 'price')
        const monthlyRevenue = bookings
            .filter(b => b.status === 'confirmed')
            .reduce((acc, b) => acc + (b.price || 0), 0);

        const dashboardData = {
            totalCars: cars.length,
            totalBookings: bookings.length,
            pendingBookings: pendingCount,
            completedBookings: completedCount,
            recentlyBookings: bookings.slice(0, 5),
            monthlyRevenue
        };

        return res
        .status(200)
        .json({
            success: true,
            message: 'Dashboard data fetched successfully',
            dashboardData 
        });

    } catch (error) {
        console.error('Get Dashboard Data Error:', error);
        return res
            .status(500)
            .json({
                success: false,
                message: 'Server error',
                error: error.message
            });
    }
};

// APi to update user Image
export const updateUserImage = async (req, res) => {
    try {
        const { _id } = req.user;

        // Upload image to ImageKit
        const fileBuffer = imageFile.buffer || fs.readFileSync(imageFile.path);
        const response = await imagekit.upload({
            file: fileBuffer, //required
            fileName: imageFile.originalname,   //required
            folder: "/users"
        });

        // Optimization through image URL transformation
        var optimisedImageUrl = imagekit.url({
            path: response.filePath,
            transformation: [
                { width: '400' },
                { quality: 'auto' }, // Auto Compression
                { format: 'webp' } // Convert to modern format
            ]
        });

        const image = optimisedImageUrl;

        await User.findByIdAndUpdate(_id, { image });

        return res
        .status(200)
        .json({
            success: true,
            message: 'User image updated successfully',
            image
        });

    } catch (error) {
        console.error('Update User Image Error:', error);  
        return res
        .status(500)
        .json({
            success: false,
            message: 'Error updating user image',
            error: error.message
        })
    }
};