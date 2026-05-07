import { DEPARTMENTS } from "../constants/departments.js";
import Attendance from "../models/attendance.models.js";
import Employee from "../models/employee.models.js";
import LeaveApplication from "../models/leaveApplication.models.js";
import Payslip from "../models/payslips.models.js";

// Get dashboard for employee and admin
// GET /api/v1/dashboard
export const getDashboard = async (req, res) => {
    try {
        const session = req.session;
        if (session.role === 'ADMIN') {
            const [totalEmployees, todayAttendance, pendingLeaves] = await Promise.all([
                Employee.countDocuments({
                    isDeleted: {
                        $ne: true
                    }
                }),
                Attendance.countDocuments({
                    date: {
                        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                        $lte: new Date(new Date().setHours(24, 0, 0, 0))
                    }
                }),
                LeaveApplication.countDocuments({
                    status: 'PENDING'
                })
            ])

            return res
                .status(200)
                .json({
                    success: true,
                    message: 'Admin dashboard data retrieved successfully',
                    role: 'ADMIN',
                    totalEmployees,
                    totalDepartments: DEPARTMENTS.length,
                    todayAttendance,
                    pendingLeaves
                });
        } else {
            const employee = await Employee.findOne({
                user: session.userId,
            }).lean();

            if (!employee) {
                return res
                    .status(404)
                    .json({
                        success: false,
                        message: 'Employee not found'
                    });
            }

            const today = new Date();
            const [currentMonthAttendance, pendingLeaves, latestPayslip] = await Promise.all([
                Attendance.countDocuments({
                    employeeId: employee._id,
                    date: {
                        $gte: new Date(today.getFullYear(), today.getMonth(), 1),
                        $lte: new Date(today.getFullYear(), today.getMonth() + 1, 1)
                    }
                }),
                LeaveApplication.countDocuments({
                    employeeId: employee._id,
                    status: 'PENDING'
                }),
                Payslip.findOne({
                    employeeId: employee._id
                }).sort({ createdAt: -1 }).lean()
            ])

            return res
                .status(200)
                .json({
                    success: true,
                    message: 'Employee dashboard data retrieved successfully',
                    role: 'EMPLOYEE',
                    employee: {
                        ...employee,
                        id: employee._id.toString()
                    },
                    currentMonthAttendance,
                    pendingLeaves,
                    latestPayslip: latestPayslip ? {
                        ...latestPayslip,
                        id: latestPayslip._id.toString()
                    } : null
                });
        }
    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: 'An error occurred while retrieving dashboard data',
                error: error.message
            });
    }
};