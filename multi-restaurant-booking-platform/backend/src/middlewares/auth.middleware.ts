import { NextFunction, Response, Request } from "express";
import { IUser } from "../../types/index.js";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.models.js";

export interface AuthRequest extends Request {
    user?: IUser;
};

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {

            // get Token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify Token
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

            // Get user from the token, exclude password
            const user = await UserModel.findById(decoded.id).select('-password');

            if (!user) {
                res
                    .status(401)
                    .json({
                        success: false,
                        message: 'Not authorized, user not found'
                    });

                return;
            }

            req.user = user;
            next();

        } catch (error) {
            console.error('Auth Middleware Error:', error);
            res
                .status(401)
                .json({
                    success: false,
                    message: 'Not authorized, token failed'
                });

            return;
        }
    }

    if (!token) {
        res
            .status(401)
            .json({
                success: false,
                message: 'Not authorized, no token'
            });
    }
};

// Middleware for Admin only
export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (req.user && req.user.role === 'admin') {
        next(); // User is admin, proceed to the next middleware or route handler
    } else {
        res
            .status(403)
            .json({
                success: false,
                message: 'Access denied, admin only'
            });
    }
};

// Middleware for Owner only
export const ownerOnly = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (req.user && (req.user.role == 'admin' || req.user.role === 'owner')) {
        next(); // User is owner, proceed to the next middleware or route handler
    } else {
        res
            .status(403)
            .json({
                success: false,
                message: 'Access denied, owner only'
            });
    }
};