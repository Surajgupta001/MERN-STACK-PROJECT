import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

// Login for employees and admins
// POST /api/v1/auth/login
export const login = async (req, res) => {
    try {
        const { email, password, role_type } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Email and password are required",
                });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: "User not found",
                });
        }

        if (role_type === 'admin' && user.role !== 'ADMIN') {
            return res
                .status(403)
                .json({
                    success: false,
                    message: "Access denied. Not an admin user.",
                });
        }

        if (role_type === 'employee' && user.role !== 'EMPLOYEE') {
            return res
                .status(403)
                .json({
                    success: false,
                    message: "Access denied. Not an employee user.",
                });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "Invalid credentials",
                });
        }

        const payload = {
            userId: user._id.toString(),
            role: user.role,
            email: user.email,
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET);

        return res
            .status(200)
            .json({
                success: true,
                message: "Login successful",
                user: payload,
                token,
            });
    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: "Internal server error",
            });
    }
};

// Get session for employees and admins
// GET /api/v1/auth/session
export const getSession = async (req, res) => {
    try {
        const session = req.session;
        if (!session || !session.user) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "No active session",
                });
        }

        return res
            .status(200)
            .json({
                success: true,
                message: "Session active",
                user: session
            });
    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: "Internal server error",
            });
    }
};

// Change password for employees and admins
// POST /api/v1/auth/change-password
export const changePassword = async (req, res) => {
    try {
        const session = req.session;
        const { currentPassword, newPassword } = req.body;

        if (currentPassword || !newPassword) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Current password and new password are required",
                });
        }

        const user = await User.findById(session.userId);

        if (!user) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: "User not found",
                });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "Current password is incorrect",
                });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(session.userId, { password: hashedPassword });

        return res
            .status(200)
            .json({
                success: true,
                message: "Password changed successfully",
            });

    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: "Internal server error",
            });
    }
};