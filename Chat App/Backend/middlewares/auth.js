import jwt from 'jsonwebtoken';
import User from '../models/user.models.js';

// Middlewares to protect routes
export const protectRoute = async (req, res, next) => {
    try {

        const token = req.headers.token;

        const decode = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decode.userId).select('-password');

        if (!user) {
            return res
            .status(404)
            .json({
                success: false,
                message: 'User not found'
            });
        }

        req.user = user;
        next();

    } catch (error) {
        console.error('Error during token verification:', error.message);
        return res
        .status(401)
        .json({
            success: false,
            message: 'Unauthorized',
            error: error.message
        });
    }
};