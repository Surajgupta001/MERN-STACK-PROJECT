import Employee from "../models/employee.models.js";

// Get Profile
// GET /api/v1/profile
export const getProfile = async (req, res) => {
    try {
        const session = req.session;
        const employee = await Employee.findOne({
            userId: session.userId,
        });

        if (!employee) {
            // Authenticated user is not an employee - return admin profile
            return res
                .status(200)
                .json({
                    firstName: 'Admin',
                    lastName: '',
                    email: session.email,
                });
        }

        return res
            .status(200)
            .json({
                success: true,
                message: "Profile fetched successfully",
                employee
            });

    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: "Error fetching profile",
                error: error.message,
            });
    }
};

// Update Profile
// PUT /api/v1/profile
export const updateProfile = async (req, res) => {
    try {
        const session = req.session;
        const employee = await Employee.findOne({
            userId: session.userId,
        });

        if (!employee) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: "Employee profile not found",
                });
        }

        if (employee.isDeleted) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Cannot update profile of a deleted employee",
                });
        }

        await Employee.findByIdAndUpdate(
            employee._id, {
            bio: req.body.bio
        }
        );

        return res
            .status(200)
            .json({
                success: true,
                message: "Profile updated successfully",
            });
    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: "Error updating profile",
                error: error.message,
            });
    }
};