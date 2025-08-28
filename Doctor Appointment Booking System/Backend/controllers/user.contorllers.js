import validator from 'validator';
import bcrypt from 'bcrypt';
import User from '../models/user.models.js';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import Doctor from '../models/doctor.models.js';
import Appointment from '../models/appointment.models.js';
import razorpay from 'razorpay';

// Api to register user
const registerUser = async (req, res) => {
    
    try {
        const { name, email, password } = req.body;
    
        if (!name || !email || !password) {
            return res
            .status(400)
            .json({
                success: false,
                message: "All fields are required" 
            });
        };
    
        if (!validator.isEmail(email)) {
            return res
            .status(400)
            .json({
                success: false,
                message: "Invalid email format"
            });
        };
        
        if (password.length < 8) {
            return res
            .status(400)
            .json({
                success: false,
                message: "Password must be at least 8 characters long"
            });
        };

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res
            .status(400)
            .json({
                success: false,
                message: "User already exists with this email"
            });
        }

        // Hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            name,
            email,
            password: hashedPassword
        };
        
        const newUser = new User(userData);
        const user = await newUser.save();

        const token = jwt.sign(
            { id: user._id }, process.env.JWT_SECRET
        );

        return res
        .status(201)
        .json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            token
        });

    } catch (error) {
        console.error("Error in registerUser:", error);
        return res
        .status(500)
        .json({
            success: false,
            message: "Internal server error"
        });
    }

};

// APi for user login
const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res
            .status(404)
            .json({
                success: false,
                message: "User not found"
            });
        };

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = jwt.sign(
                { id: user._id }, process.env.JWT_SECRET
            );

            return res
            .status(200)
            .json({
                success: true,
                message: "User logged in successfully",
                token
            });
        }
        else {
            return res
            .status(400)
            .json({
                success: false,
                message: "Invalid credentials"
            });
        }

    } catch (error) {
        console.error("Error in loginUser:", error);
        return res
        .status(500)
        .json({
            success: false,
            message: "Internal server error"
        });
    }
};

// API to get user profile data
const getProfile = async (req, res) => {

    try {
        const { userId } = req.body
        const userData = await User.findById(userId).select('-password')

        res
        .status(200)
        .json({
            success: true,
            message: "User profile fetched successfully",
            userData
        });

    } catch (error) {
        console.log(error)
        res
        .status(500)
        .json({
            success: false,
            message: error.message
        });
    }
};

// Api to update user profile
const updateProfile = async (req, res) => {
    
    try {
        
        const { userId, name, phone, address, dob, gender } = req.body;
        const imageFile = req.file;

        if (!name || !phone || !dob || !gender) {
            return res
            .status(400)
            .json({
                success: false,
                message: "All fields are required"
            });
        };

        await User.findByIdAndUpdate(
            userId, 
            {
                name,
                phone,
                address : JSON.stringify(address),
                dob,
                gender
            }
        );

        if (imageFile) {
            
            // upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
                resource_type: "image"
            });

            const imageURL = imageUpload.secure_url;

            await User.findByIdAndUpdate(
                userId,
                { image: imageURL }
            );
        };

        res
        .status(200)
        .json({
            success: true,
            message: "User profile updated successfully"
        });

    } catch (error) {
        console.log(error);
        res
        .status(500)
        .json({
            success: false,
            message: error.message
        });
    }
};

// Api to book appointment
const bookAppointment = async (req, res) => {

    try {

        const { userId, docId, slotDate, slotTime } = req.body;

        const docData = await Doctor.findById(docId).select('-password');

        if (!docData || !docData.available) {
            return res
            .status(404)
            .json({
                success: false,
                message: "Doctor not available"
            });
        };

        let slots_booked = docData.slots_booked || {};

        // Checking for slot availability
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res
                .status(400)
                .json({
                    success: false,
                    message: "Slot already booked"
                });
            } else {
                slots_booked[slotDate].push(slotTime);
            }
        } else {
            slots_booked[slotDate] = [slotTime];
        }

        const userData = await User.findById(userId).select('-password');

        if (!userData) {
            return res
            .status(404)
            .json({
                success: false,
                message: "User not found"
            });
        }

        const appointmentData = {
            userId,
            docId,
            userData,
            docData: {
                _id: docData._id,
                name: docData.name,
                image: docData.image,
                speciality: docData.speciality,
                degree: docData.degree,
                experience: docData.experience,
                about: docData.about,
                fees: docData.fees,
                address: docData.address
            },
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        };

        const newAppointment = new Appointment(appointmentData);
        await newAppointment.save();

        // Save new slots in docData
        await Doctor.findByIdAndUpdate(
            docId,
            { slots_booked }
        );

        res
        .status(201)
        .json({
            success: true,
            message: "Appointment booked successfully",
            appointment: newAppointment
        });

    } catch (error) {
        console.log(error);
        res
        .status(500)
        .json({
            success: false,
            message: error.message
        });
    }
};

// Api to get user appointments for my appointments page
const listAppointment = async (req, res) => {

    try {

        const { userId } = req.body;
        const appointments = await Appointment.find({userId});

        res
        .status(200)
        .json({
            success: true,
            appointments,
            message: "Appointments fetched successfully"
        });
        
    } catch (error) {
        console.log(error);
        res
        .status(500)
        .json({
            success: false,
            message: error.message
        });
    }
};

// Api to cancel appointment
const cancelAppointment = async (req, res) => {

    try {
        const { userId, appointmentId } = req.body;

        const appointmentData = await Appointment.findById(appointmentId);

        // Verify appointment user
        if (appointmentData.userId != userId) {
            return res
            .status(403)
            .json({
                success: false,
                message: "You are not authorized to cancel this appointment"
            });
        }

        await Appointment.findByIdAndUpdate(
            appointmentId, { 
                cancelled: true 
            }
        );

        // Releasing doctor slot
        const { docId, slotDate, slotTime } = appointmentData;
        
        const docData = await Doctor.findById(docId);

        let slots_booked = docData.slots_booked;

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);

        await Doctor.findByIdAndUpdate(
            docId,
            { slots_booked }
        );

        res
        .status(200)
        .json({
            success: true,
            message: "Appointment cancelled successfully"
        });

    } catch (error) {
        console.log(error);
        res
        .status(500)
        .json({
            success: false,
            message: error.message
        });
    }
};

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Razorpay payment integration
const paymentRazorpay = async (req, res) => {

    try {

        const { appointmentId } = req.body;
        console.log("Creating Razorpay order for appointment:", appointmentId);

        const appointmentData = await Appointment.findById(appointmentId);
        
        if (!appointmentData) {
            return res
            .status(404)
            .json({
                success: false,
                message: "Appointment not found"
            });
        }

        if (appointmentData.payment) {
            return res
            .status(400)
            .json({
                success: false,
                message: "Appointment already paid"
            });
        }

        // Creating options for Razorpay payment
        const options = {
            amount: appointmentData.amount * 100, // Amount in paise
            currency: process.env.CURRENCY || 'INR',
            receipt: appointmentId, // Use appointmentId directly as receipt
        };

        console.log("Razorpay order options:", options);

        // Creating order in Razorpay
        const order = await razorpayInstance.orders.create(options);
        
        console.log("Razorpay order created:", order.id);

        res
        .status(200)
        .json({
            success: true,
            message: "Razorpay order created successfully",
            order
        });

    } catch (error) {
        console.error("Error in paymentRazorpay:", error);
        res
        .status(500)
        .json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
        
    }
};

// Api to verify Razorpay payment
const verifyRazorpay = async (req, res) => {

    try {

        const { razorpay_order_id, razorpay_payment_id } = req.body;
        
        // Get order info to find the appointment
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

        if (razorpay_payment_id) {
            // Update appointment payment status
            await Appointment.findByIdAndUpdate(
                orderInfo.receipt, {
                    payment: true
                }
            );

            return res
            .status(200)
            .json({
                success: true,
                message: "Payment verified successfully"
            });
            
        } else {
            return res
            .status(400)
            .json({
                success: false,
                message: "Payment verification failed"
            });
        }

    } catch (error) {
        console.error("Error in verifyRazorpay:", error);
        res
        .status(500)
        .json({
            success: false,
            message: "Internal server error"
        });
        
    }
};

export {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    bookAppointment,
    listAppointment,
    cancelAppointment,
    paymentRazorpay,
    verifyRazorpay
};