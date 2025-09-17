import User from "../models/user.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Car from "../models/car.models.js";

// Generate JWT Token
const generateToken = (userId) => {
    const payload = userId;
    return jwt.sign(payload, process.env.JWT_SECRET);
};

// Register User
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if(!name || !email || !password || password.length < 8){
            return res
            .status(400)
            .json({
                success: false,
                message: 'All fields are required and password must be at least 8 characters long'
            })
        }

        const userExists = await User.findOne({ email });

        if(userExists){
            return res
            .status(400)
            .json({
                success: true,
                message: 'User already exists'
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        const token = generateToken(user._id.toString());

        return res
        .status(201)
        .json({
            success: true,
            message: 'User registered successfully',
            token
        });

    } catch (error) {
        console.error('Register User Error:', error);
        return res
        .status(500)
        .json({
            success: false,
            message: 'Internal server error',
            error: error.message
        })
    }
};

// Login User
export const loginUser = async (req, res) => {
    try {
        
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if(!user){
            return res
            .status(400)
            .json({
                success: false,
                message: 'User not found'
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res
            .status(400)
            .json({
                success: false,
                message: 'Invalid credentials'
            })
        }

        const token = generateToken(user._id.toString());
        
        return res
        .status(200)
        .json({
            success: true,
            message: 'User logged in successfully',
            token
        });

    } catch (error) {
        console.error('Login User Error:', error);
        return res
        .status(500)
        .json({
            success: false,
            message: 'Internal server error',
            error: error.message
        })
    }
};

// Get user data using Token(JWT)
export const getUserData = async (req, res) => {
    try {
        const { user } = req;
        return res
        .status(200)
        .json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Get User Data Error:', error);
        return res
        .status(500)
        .json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get all Cars for the Frontend
export const getCars = async (req, res) => {
    try {
        const cars = await Car.find({ isAvailable: true })
        return res
        .status(200)
        .json({
            success: true,
            message: 'Cars fetched successfully',
            cars
        })
    } catch (error) {
        console.error('Get Cars Error:', error);
        return res
        .status(500)
        .json({
            success: false,
            message: 'Internal server error',
            error: error.message
        })
    }
};