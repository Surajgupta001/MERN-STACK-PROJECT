import Doctor from '../models/doctor.models.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Appointment from '../models/appointment.models.js';

const changeAvailability = async (req, res) => {
    try {
        const { docId } = req.body;

        const docData = await Doctor.findById(docId);

        await Doctor.findByIdAndUpdate(docId, {
            available: !docData.available,
        });

        res.status(200).json({
            success: true,
            message: 'Doctor availability updated successfully',
        });
    } catch (error) {
        console.error('Error updating doctor availability:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update doctor availability',
        });
    }
};

const doctorList = async (req, res) => {
    try {
        const doctors = await Doctor.find({}).select('-password -email');

        return res.status(200).json({
            success: true,
            message: 'Doctor list fetched successfully',
            data: doctors,
        });
    } catch (error) {
        console.error('Error fetching doctor list:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to fetch doctor list',
        });
    }
};

// Api for login doctor
const loginDoctor = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Doctor.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            res.status(200).json({
                success: true,
                message: 'Login successfully',
                token,
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Invalid credentials',
            });
        }
    } catch (error) {
        console.error('Error logging in doctor:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to login doctor',
        });
    }
};

// API to get doctor appointments for doctor panel
const appointmentsDoctor = async (req, res) => {
    try {
        const { docId } = req.body;
        const appointments = await Appointment.find({ docId });

        res.status(200).json({
            success: true,
            message: 'Doctor appointments fetched successfully',
            appointments,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Api to mark appointment as completed
const appointmentComplete = async (req, res) => {
    try {
        const { docId, appointmentId } = req.body;

        const appointmentData = await Appointment.findById(appointmentId);

        if (appointmentData && appointmentData.docId === docId) {
            await Appointment.findByIdAndUpdate(appointmentId, {
                isCompleted: true,
            });
            return res.status(200).json({
                success: true,
                message: 'Appointment marked as completed',
            });
        } else {
            return res.status(404).json({
                success: false,
                message:
                    'Appointment not found or does not belong to this doctor',
            });
        }
    } catch (error) {
        console.error('Error completing appointment:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to complete appointment',
        });
    }
};

// Api to mark appointment as cancelled
const appointmentCancel = async (req, res) => {
    try {
        const { docId, appointmentId } = req.body;

        const appointmentData = await Appointment.findById(appointmentId);

        if (appointmentData && appointmentData.docId === docId) {
            await Appointment.findByIdAndUpdate(appointmentId, {
                cancelled: true,
            });

            return res.status(200).json({
                success: true,
                message: 'Appointment marked as cancelled',
            });
        } else {
            return res.status(404).json({
                success: false,
                message:
                    'Appointment not found or does not belong to this doctor',
            });
        }
    } catch (error) {
        console.error('Error cancelling appointment:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to cancel appointment',
        });
    }
};

// Api to get dashboard data for doctor
const doctorDashboard = async (req, res) => {
    try {
        const { docId } = req.body;

        const appointments = await Appointment.find({ docId });

        let earnings = 0;
        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount;
            }
        });

        let patients = [];
        appointments.map((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId);
            }
        });

        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse(),
        };

        return res.status(200).json({
            success: true,
            message: 'Doctor dashboard data fetched successfully',
            data: dashData,
        });

    } catch (error) {
        console.error('Error fetching doctor dashboard data:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch doctor dashboard data',
        });
    }
};

// Api to get doctor profile for doctor panel
const doctorProfile = async (req, res) => {

    try {

        const { docId } = req.body;

        const profileData = await Doctor.findById(docId).select('-password');
            
        res
        .status(200).json({
            success: true,
            message: 'Doctor profile fetched successfully',
            data: profileData,
        });

    } catch (error) {
        console.error('Error fetching doctor profile:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch doctor profile',
        });
        
    }
};

// Api to update doctor profile
const updateDoctorProfile = async (req, res) => {

    try {

        const { docId, fees, address, available } = req.body;

        await Doctor.findByIdAndUpdate(docId, {
            fees,
            address,
            available,
        });

        return res.status(200).json({
            success: true,
            message: 'Doctor profile updated successfully',
        });

    } catch (error) {
        console.error('Error updating doctor profile:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update doctor profile',
        });
        
    }
};

export {
    changeAvailability,
    doctorList,
    loginDoctor,
    appointmentsDoctor,
    appointmentComplete,
    appointmentCancel,
    doctorDashboard,
    doctorProfile,
    updateDoctorProfile
};
