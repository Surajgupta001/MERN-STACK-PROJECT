import { Request, Response } from "express";
import UserModel from "../models/user.models.js";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/utils.js";
import { AuthRequest } from "../middlewares/auth.middleware.js";

// Register a new user
// POST /api/auth/register
export const registerUser = async (req: Request, res: Response) => {
    try {

        // Destructure the request body
        const { name, email, password, phone, role } = req.body;

        // Check if all required fields are provided
        if (!name || !email || !password) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: 'Please provide all required fields'
                });
        }

        // Check if the user already exists
        const userExists = await UserModel.findOne({ email });

        if (userExists) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: 'User already exists'
                });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = await UserModel.create({
            name,
            email,
            password: hashedPassword,
            phone,
            role
        });

        if (newUser) {
            res
                .status(201)
                .json({
                    _id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    phone: newUser.phone,
                    role: newUser.role,
                    token: generateToken(newUser._id.toString())
                })
        } else {
            res
                .status(400)
                .json({
                    success: false,
                    message: 'Invalid user data'
                });
        }

    } catch (error: any) {
        console.error(error);
        res
            .status(500)
            .json({
                success: false,
                message: error.message || 'Server Error'
            });
    }
};

// Authenticate user and get token
// POST /api/auth/login
export const loginUser = async (req: Request, res: Response) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: 'Please provide email and password'
                });
        }

        // Check for user
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: 'Invalid credentials'
                });
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: 'Invalid credentials'
                });
        }

        res
            .status(200)
            .json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                token: generateToken(user._id.toString())
            })

    } catch (error: any) {
        console.error(error);
        res
            .status(500)
            .json({
                success: false,
                message: error.message || 'Server Error'
            });
    }
};

// get user profile
// GET /api/auth/me
// @acess Private
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res
                .status(401)
                .json({
                    success: false,
                    message: 'Not authorized'
                });
        }

        res.json(req.user);

    } catch (error: any) {
        console.error(error);
        res
            .status(500)
            .json({
                success: false,
                message: error.message || 'Server Error'
            });
    }
};

