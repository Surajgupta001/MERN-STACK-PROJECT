import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Resume from "../models/Resume.js";

const generateToken = (userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });
    return token;
};

// Controllers for user registration
// POST: /api/v1/users/register
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // check if required fields are present
        if (!name || !email || !password) {
            return res
            .status(400)
            .json({
                success: false,
                message: "Please provide name, email and password"
            })
        }

        // check if user already exists
        const user = await User.findOne({ email });
        if (user) {
            return res
            .status(400)
            .json({
                success: false,
                message: "User already exists"
            })
        }

        // Create new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        })

        // return success response with token
        const token = generateToken(newUser._id);
        newUser.password = undefined; // hide password

        return res
        .status(201)
        .json({
            success: true,
            message: "User registered successfully",
            token,
            user: newUser
        })
        
    } catch (error) {
        console.error("Error in registerUser:", error);
        return res
        .status(400)
        .json({
            success: false,
            message: error.message
        });
    }
};

// Controllers for user login
// POST: /api/v1/users/login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // check if user already exists
        const user = await User.findOne({ email });
        if (!user) {
            return res
            .status(400)
            .json({
                success: false,
                message: "User does not exist"
            })
        }

        // check if password is correct
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res
            .status(401)
            .json({
                success: false,
                message: "Invalid email or password"
            })
        }

        // return success response with token
        const token = generateToken(user._id);
        user.password = undefined; // hide password

        return res
        .status(200)
        .json({
            success: true,
            message: "User logged in successfully",
            token,
            user
        })

    } catch (error) {
        console.error("Error in loginUser:", error);
        return res
        .status(400)
        .json({
            success: false,
            message: error.message
        });
    }
};

// Controllers for getting user by id
// GET: /api/v1/users/data
export const getUserById = async (req, res) => {
    try {
        const userId = req.userId;

        // Check if user exists
        const user = await User.findById(userId)
        if (!user) {
            return res
            .status(404)
            .json({
                success: false,
                message: "User not found"
            })
        }

        // return success response with user data
        user.password = undefined; // hide password
        return res
        .status(200)
        .json({
            success: true,
            user
        })

    } catch (error) {
        console.error("Error in getUserById:", error);
        return res
        .status(400)
        .json({
            success: false,
            message: error.message
        })
    }
};

// Controllers for getting user resumes
// GET: /api/v1/users/resumes
export const getUserResumes = async (req, res) => {
    try {
        const userId = req.userId;

        // return user resumes
        const resumes = await Resume.find({ userId });
        
        return res
        .status(200)
        .json({
            success: true,
            message: "User resumes fetched successfully",
            resumes
        });
        
    } catch (error) {
        console.error("Error in getUserResumes:", error);
        return res
        .status(400)
        .json({
            success: false,
            message: error.message
        });
    }
};