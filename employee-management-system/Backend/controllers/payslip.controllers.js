import Employee from "../models/employee.models.js";
import Payslip from "../models/payslips.models.js";

// Create payslip
// POST /api/v1/payslip
export const createPayslip = async (req, res) => {
    try {
        const { employeeId, month, year, basicSalary, allowances, deductions } = req.body;

        if (!employeeId || !month || !year || !basicSalary) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Employee ID, month, year, and basic salary are required",
                });
        }

        const netSalary = Number(basicSalary) + Number(allowances || 0) - Number(deductions || 0);

        const payslip = await Payslip.create({
            employeeId,
            month: Number(month),
            year: Number(year),
            basicSalary: Number(basicSalary),
            allowances: Number(allowances || 0),
            deductions: Number(deductions || 0),
            netSalary,
        });

        return res
            .status(201)
            .json({
                success: true,
                message: "Payslip created successfully",
                data: payslip
            });

    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: "Error creating payslip",
                error: error.message,
            });
    }
};

// Get payslips
// GET /api/v1/payslips
export const getPayslips = async (req, res) => {
    try {
        const session = req.session;
        const Admin = session.role === "ADMIN";

        if (Admin) {
            const payslips = await Payslip.find().populate("employeeId").sort({ createdAt: -1 });
            const data = payslips.map((p) => {
                const obj = p.toObject();
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
                    message: "Payslips fetched successfully",
                    data
                });

        } else {
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

            const payslips = await Payslip.find({
                employeeId: employee._id,
            }).sort({ createdAt: -1 });

            return res
                .status(200)
                .json({
                    success: true,
                    message: "Payslips fetched successfully",
                    data: payslips,
                });
        }
    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: "Error fetching payslips",
                error: error.message,
            });
    }
};

// Get payslip by ID
// GET /api/v1/payslip/:id
export const getPayslipById = async (req, res) => {
    try {
        const payslips = await Payslip.findById(req.params.id).populate("employeeId").lean();

        if (!payslips) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: "Payslip not found",
                });
        }

        const result = {
            ...payslips,
            id: payslips._id.toString(),
            employee: payslips.employeeId,
        }

        return res
            .status(200)
            .json({
                success: true,
                message: "Payslip fetched successfully",
                result,
            });

    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: "Error fetching payslip",
                error: error.message,
            });
    }
};