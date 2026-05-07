import { inngest } from "../inngest/index.js";
import Attendance from "../models/attendance.models.js";
import Employee from "../models/employee.models.js";

// Clock in/out for employee
// POST /api/v1/attendance/
export const clockInOut = async (req, res) => {
    try {
        const session = req.session;
        const employee = await Employee.findOne({
            useId: session.userId,
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
                    message: "Your account is inactive. You cannot clock in or out.",
                });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const existing = await Attendance.findOne({
            employeeId: employee._id,
            date: today,
        });

        const now = new Date();

        if (!existing) {
            const isLate = now.getHours() >= 9 && now.getMinutes() > 0;

            const attendance = await Attendance.create({
                employeeId: employee._id,
                date: today,
                checkIn: now,
                status: isLate ? "LATE" : "PRESENT",
            });

            await inngest.send({
                name: "employee/check-out",
                data: {
                    employeeId: employee._id,
                    attendanceId: attendance._id,
                }
            })

            return res
                .status(201)
                .json({
                    success: true,
                    message: "Checked in successfully",
                    type: "CHECK_IN",
                    data: attendance,
                });

        } else if (!existing.checkOut) {
            const checkInTime = new Date(existing.checkIn).getTime();
            const diffMs = now.getTime() - checkInTime;
            const diffHours = diffMs / (1000 * 60 * 60);

            existing.checkOut = now;

            // Compute working hours and day type
            const workingHours = parseFloat(diffHours.toFixed(2));

            let dayType = "Half Day";
            if (workingHours >= 8) dayType = "Full Day";
            else if (workingHours >= 6) dayType = "Three Quarter Day";
            else if (workingHours >= 4) dayType = "Half Day";
            else dayType = "Short Day";

            existing.workingHours = workingHours;
            existing.dayType = dayType;

            await existing.save();

            return res
                .status(200)
                .json({
                    success: true,
                    message: "Checked out successfully",
                    type: "CHECK_OUT",
                    data: existing,
                });

        } else {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "You have already clocked in and out today",
                    type: "CHECK_OUT",
                    data: existing,
                });
        }
    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: "Failed to clock in/out. Please try again later.",
            });
    }
};

// Get attendance for employee
// GET /api/v1/attendance
export const getAttendance = async (req, res) => {
    try {
        const session = req.session;
        const employee = await Employee.findOne({
            useId: session.userId,
        });

        if (!employee) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: "Employee not found",
                });
        }

        const limit = parseInt(req.query.limit || 30);
        const history = await Attendance.find({
            employeeId: employee._id,
        }).sort({ date: -1 }).limit(limit);

        return res
            .status(200)
            .json({
                success: true,
                message: "Attendance records retrieved successfully",
                data: history,
                employee: {
                    isDeleted: employee.isDeleted,
                }
            });

    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: "Failed to retrieve attendance records.",
            });
    }
};
