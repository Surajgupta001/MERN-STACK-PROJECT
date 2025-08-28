import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.models.js";
import bcrypt from 'bcryptjs';

// Signup new user
export const signup = async (req, res) => {

    const { fullName, email, password, bio } = req.body;

    try {

        if (!fullName || !email || !password) {
            return res
            .status(400)
            .json({
                success: false,
                message: 'All fields are required'
            })
        }

        const user = await User.findOne({ email });
        if (user) {
            return res
            .status(400)
            .json({
                success: false,
                message: 'User already exists'
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            bio
        });

        const token = generateToken(newUser._id);

    const userObj = newUser.toObject();
    userObj.profilePic = userObj.profilePicture;
    
    res
    .status(201)
    .json({ 
        success: true, 
        message: 'User created successfully', 
        user: userObj, 
        token 
    });

    } catch (error) {
        console.error('Error during signup:', error.message);
        return res
        .status(500)
        .json({
            success: false,
            message: 'Internal server error',
            error: error.message
        })
    }
};

// Login user
export const login = async (req, res) => {

    try {

        const { email, password } = req.body;
        const userData = await User.findOne({email});

        const isPasswordCorrect = await bcrypt.compare(password, userData.password);

        if (!isPasswordCorrect) {
            return res
            .status(400)
            .json({
                success: false,
                message: 'Invalid email or password'
            })
        }

        const token = generateToken(userData._id);

    const userObj = userData.toObject();
    userObj.profilePic = userObj.profilePicture;
    
    res
    .status(200)
    .json({ 
        success: true, 
        message: 'Login successful', 
        user: userObj, 
        token 
    });

    } catch (error) {
        console.error('Error during login:', error.message);
        return res
        .status(500)
        .json({
            success: false,
            message: 'Internal server error',
            error: error.message
        })
    }
};

// Check if user is authenticated
export const checkAuth = (req, res) => {
    const userObj = req.user.toObject();
    userObj.profilePic = userObj.profilePicture;
    
    res
    .status(200)
    .json({ 
        success: true, 
        message: 'User is authenticated', 
        user: userObj 
    });
};

// Update User profile details
export const updateProfile = async (req, res) => {
    try {

    const { profilePic, bio, fullName } = req.body; // frontend sends profilePic (base64 data URI)

        const userId = req.user._id;

        let updatedUser;

        if (profilePic) {
            // Upload only if new image provided (data URI string)
            const upload = await cloudinary.uploader.upload(profilePic);
            updatedUser = await User.findByIdAndUpdate(
                userId,
                { profilePicture: upload.secure_url, bio, fullName },
                { new: true }
            ).select('-password');
        } else {
            updatedUser = await User.findByIdAndUpdate(
                userId,
                { bio, fullName },
                { new: true }
            ).select('-password');
        }

        // Normalize response so frontend can read user.profilePic if desired
        const userResponse = updatedUser.toObject();
        userResponse.profilePic = userResponse.profilePicture;

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: userResponse
        });

    } catch (error) {
        console.error('Error updating profile:', error.message);
        return res
        .status(500)
        .json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};