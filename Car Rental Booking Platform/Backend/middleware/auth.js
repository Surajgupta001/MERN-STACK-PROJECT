import jwt from 'jsonwebtoken';
import User from '../models/user.models.js';

export const protect = async (req, res, next) => {
    const token = req.headers.authorization;
    
    if(!token){
        return res
        .status(401)
        .json({
            success: false,
            message: 'No token, authorization denied' 
        });
    }

    try {
        const userId = jwt.decode(token, process.env.JWT_SECRET);
        
        if(!userId){
            return res
            .status(401)
            .json({
                success: false,
                message: 'Token is not valid'
            })
        }

        req.user = await User.findById(userId).select('-password');
        next();

    } catch (error) {
        console.error('Auth Middleware Error:', error);
        return res
        .status(401)
        .json({
            success: false,
            message: 'Not authorized, token failed'
        });
    }
};