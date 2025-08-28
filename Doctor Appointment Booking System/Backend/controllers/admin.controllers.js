import validator from 'validator';
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import Doctor from '../models/doctor.models.js';
import jwt from 'jsonwebtoken';
import Appointment from '../models/appointment.models.js';
import User from '../models/user.models.js';

// API for adding Doctor
const addDoctor = async (req, res) => {

    try {

        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body
        const imageFile = req.file

        // checking for all data to add doctor
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            
            return res
            .status(400)
            .json({
                success: false,
                message: "Missing Details",
            });
        };

        // validating email format
        if (!validator.isEmail(email)) {
            
            return res
            .status(400)
            .json({ 
                success: false, 
                message: "Please enter a valid email"
            });
        };

        // validating strong password
        if (password.length < 8) {
            
            return res
            .status(400)
            .json({ 
                success: false, 
                message: "Please enter a strong password"
            });
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10); // the more no. round the more time it will take
        const hashedPassword = await bcrypt.hash(password, salt)

        // upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(
            imageFile.path, { 
                resource_type: "image" 
            }
        );
        const imageUrl = imageUpload.secure_url

        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now()
        }

        const newDoctor = new Doctor(doctorData);
        await newDoctor.save()
        
        res.
        status(201)
        .json({ 
            success: true, 
            message: 'Doctor Added Successfully', 
        });

    } catch (error) {
        console.log(error)
        res.
        status(500)
        .json({ success: false, 
            message: error.message 
        });
    }
};

// API for admin Login
const loginAdmin = async (req, res) => {
    try {
        
        const { email, password } = req.body;
        
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {

            // Generate JWT token
            const token = jwt.sign(
                email + password,
                process.env.JWT_SECRET
            );

            return res
            .status(200)
            .json({ 
                success: true, 
                message: "Admin Login Successful",
                token
            });
        } 
        else {
            return res
            .status(400)
            .json({ 
                success: false, 
                message: "Invalid Admin Credentials" 
            });
        }

    } 
    catch (error) {
        console.log(error);
        res
        .status(500)
        .json({ 
            success: false, 
            message: error.message
        });
    }
};

// API to get all doctors lost for admin panel
const allDoctors = async (req, res) => {
    try {

        const doctors = await Doctor.find({}).select('-password');

        res
        .status(200)
        .json({ 
            success: true, 
            data: doctors,
            message: "Doctors fetched successfully"
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

// Api to get all appointments list
const appointmentsAdmin = async (req, res) => {

    try {

        const appointments = await Appointment.find({});

        return res
        .status(200)
        .json({ 
            success: true, 
            data: appointments,
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

// Api for appointment cancellation by admin
const appointmentCancel = async (req, res) => {

    try {
        const { appointmentId } = req.body;

        const appointmentData = await Appointment.findById(appointmentId);

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

// Api to get Dashboard data for admin panel
const adminDashboard = async (req, res) => {

    try {

        const doctors = await Doctor.find({});
        const users = await User.find({});
        const appointments = await Appointment.find({});

        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            users: users.length,
            latestAppointments: appointments.reverse().slice(0, 5)
        }

        res
        .status(200)
        .json({
            success: true,
            dashData: dashData,
            message: "Dashboard data fetched successfully"
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

export {
    addDoctor,
    loginAdmin,
    allDoctors,
    appointmentsAdmin,
    appointmentCancel,
    adminDashboard
};