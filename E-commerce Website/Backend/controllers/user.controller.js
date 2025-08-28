import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";

const createToken = (id) => {
    return jwt.sign({
        id
    },
        process.env.JWT_SECRET, {
        expiresIn: '3d'
    })
};

// Route for user login
const loginUser = async (req, res) => {
    // Logic for user login
    const { email, password } = req.body;

    const user = await UserModel.findOne({email});

    if(!user) {
        return res
        .status(404)
        .json({
            success: false,
            message: 'User not found with this email address'
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(isMatch) {
        const token = createToken(user._id);
        res
        .status(200)
        .json({
            success: true,
            message: 'User logged in successfully',
            token
        });
    }
    else{
        res
        .status(400)
        .json({
            success: false,
            message: 'Invalid credentials, please try again'
        });
    }
}

// Route for user register
const registerUser = async (req, res) => {
    // Logic for user registration
    try {
        const { name, email, password } = req.body;

        // checking user already exists or not
        const exists = await UserModel.findOne({
            email
        });

        if (exists) {
            return res.json({
                success: false,
                message: 'User already exists with this email address'
            });
        }

        // Validating email format & strong password
        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: 'Enter a valid email address'
            });
        }

        if (password.length < 8) {
            return res.json({
                success: false,
                message: 'Password must be at least 8 characters long'
            });
        }

        // Hashing the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Creating a new user
        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword
        });

        const user = await newUser.save();

        const token = createToken(user._id);
        res.status(201)
            .json({
                success: true,
                message: 'User registered successfully',
                token
            });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Server error, please try again later'
        });

    }
}

// Route for admin login
const adminLogin = async (req, res) => {
    // Logic for admin login
    try {
        const { email, password } = req.body;
    
        if (email == process.env.ADMIN_EMAIL && password == process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(
                email + password,
                process.env.JWT_SECRET,
            );
            
            return res
            .status(200)
            .json({
                success: true,
                message: 'Admin logged in successfully',
                token
            });
        }
        else{
            return res
            .status(400)
            .json({
                success: false,
                message: 'Invalid credentials, please try again'
            });
        }
    }
    catch (error) {
        console.log(error);
        res
        .status(500)
        .json({
            success: false,
            message: 'Server error, please try again later'
        });    
    }
};

export {
    loginUser,
    registerUser,
    adminLogin
};