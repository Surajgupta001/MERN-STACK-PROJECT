import { inngest } from "../inngest/index.js";
import Employee from "../models/employee.models.js";
import LeaveApplication from "../models/leaveApplication.models.js";

// Create Leave
// POST /api/v1/leave
export const createLeave = async (req, res) => {
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
                    message: "Employee not found",
                });
        }

        if (employee.isDeleted) {
            return res
                .status(403)
                .json({
                    success: false,
                    message: "Your account is inactive. You cannot apply for leave.",
                });
        }

        const { type, startDate, endDate, reason } = req.body;

        if (!type || !startDate || !endDate || !reason) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "All fields are required",
                });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (new Date(startDate) <= today || new Date(endDate) <= today) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Start and end dates must be in the future",
                });
        }

        if (new Date(endDate) < new Date(startDate)) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "End date cannot be before start date",
                });
        }

        const leave = await LeaveApplication.create({
            employeeId: employee._id,
            type,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            reason,
            status: "PENDING",
        });

        await inngest.send({
            name: 'leave/pending',
            data: {
                leaveApplicationId: leave._id,
            }
        })

        res.status(201).json({
            success: true,
            message: "Leave application submitted successfully",
            data: leave,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while submitting your leave application. Please try again later.",
        });
    }
};

// Get Leaves
// GET /api/v1/leave
export const getLeaves = async (req, res) => {
    try {
        const session = req.session;
        const isAdmin = session.roel === "ADMIN";

        if (isAdmin) {
            const status = req.query.status;
            const where = status ? { status } : {};
            const leaves = await LeaveApplication.find(where).populate('employeeId').sort({ createdAt: -1 });
            const data = leaves.map((l) => {
                const obj = l.toObject();
                return {
                    ...obj,
                    id: obj._id.toString(),
                    employee: obj.employeeId,
                    employeeId: obj.employeeId._id.toString(),
                }
            });

            return res
                .status(200)
                .json({
                    success: true,
                    message: "Leave applications fetched successfully",
                    data,
                });
        } else {
            const employee = await Employee.findOne({
                userId: session.userId,
            }).lean();

            if (!employee) {
                return res
                    .status(404)
                    .json({
                        success: false,
                        message: "Employee not found",
                    });
            }

            const leaves = await LeaveApplication.find({
                employeeId: employee._id,
            }).sort({ createdAt: -1 });

            return res
                .status(200)
                .json({
                    success: true,
                    message: "Leave applications fetched successfully",
                    data: leaves,
                    employee: {
                        ...employee,
                        id: employee._id.toString(),
                    }
                });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching leave applications. Please try again later.",
        });
    }
};

// Update Leave Status
// PATCH /api/v1/leave/:id
export const updateLeaveStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!["APPROVED", "REJECTED", "PENDING"].includes(status)) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Invalid status value. Must be either APPROVED or REJECTED.",
                });
        }

        const leave = await LeaveApplication.findByIdAndUpdate(
            req.params.id,
            { status },
            { returnDocument: "after" }
        );

        if (!leave) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: "Leave application not found",
                });
        }

        res
            .status(200)
            .json({
                success: true,
                message: "Leave application status updated successfully",
                data: leave,
            });
    } catch (error) {
        res
            .status(500)
            .json({
                success: false,
                message: "An error occurred while updating leave application status. Please try again later.",
            });
    }
};