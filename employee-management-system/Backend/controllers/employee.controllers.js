import bcrypt from "bcrypt";
import Employee from "../models/employee.models.js";
import User from "../models/user.models.js";

// Get Employee
// GET /api/v1/employees
export const getEmployees = async (req, res) => {
    try {
        const { department } = req.query; // This is used when data comes from the URL after ?
        const where = {};

        if (department) {
            where.department = department;
        }

        const employee = await Employee.find(where).sort({ createdAt: -1 }).populate("userId", "email role").lean();
        const result = employee.map((emp) => ({
            ...emp,
            id: emp._id.toString(),
            user: emp.userId ? {
                email: emp.userId.email,
                role: emp.userId.role,
            } : null,
        }));

        return res
            .status(200)
            .json({
                success: true,
                message: "Employees fetched successfully",
                result,
            })
    } catch (error) {
        console.error("Error fetching employees:", error.message);
        return res
            .status(500)
            .json({
                success: false,
                message: "Error fetching employees",
                error: error.message,
            });
    }
};

// Create Employee
// POST /api/v1/employees
export const createEmployee = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            position,
            basicSalary,
            allowances,
            deductions,
            joinDate,
            bio,
            department,
            role,
            password
        } = req.body; // This is used when data is sent inside the body of request

        if (!email || !password || !firstName || !lastName) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Email, password, first name and last name are required",
                });
        }

        // Encrypt password
        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({
            email,
            password: hashed,
            role: role || "EMPLOYEE",
        });

        const employee = await Employee.create({
            userId: user._id,
            firstName,
            lastName,
            email,
            phone,
            position,
            department: department || "Engineering",
            basicSalary: Number(basicSalary) || 0,
            allowances: Number(allowances) || 0,
            deductions: Number(deductions) || 0,
            joinDate: joinDate ? new Date(joinDate) : new Date(),
            bio: bio || "",
        });

        return res.status(201).json({
            success: true,
            message: "Employee created successfully",
            employee,
        });

    } catch (error) {
        console.error("Error creating employee:", error.message);
        if (error.code === 11000) { // Error code 11000 = Duplicate Key Error
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Email already exists",
                });
        }

        return res
            .status(500)
            .json({
                success: false,
                message: "Error creating employee",
                error: error.message,
            });
    }
};

// Update Employee
// PUT /api/v1/employees/:id
export const updateEmployee = async (req, res) => {
    try {

        const { id } = req.params;

        const {
            firstName,
            lastName,
            email,
            phone,
            position,
            basicSalary,
            allowances,
            deductions,
            bio,
            department,
            role,
            password,
            employeeStatus,
        } = req.body;

        const employee = await Employee.findById(id);

        if (!employee) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: "Employee not found",
                });
        }

        await Employee.findByIdAndUpdate(id, {
            firstName,
            lastName,
            email,
            phone,
            position,
            department: department || 'Engineering',
            basicSalary: Number(basicSalary) || 0,
            allowances: Number(allowances) || 0,
            deductions: Number(deductions) || 0,
            bio: bio || "",
            employeeStatus: employeeStatus || "ACTIVE",
        });

        // Update User record
        const userUpdate = { email };
        if (role) {
            userUpdate.role = role;
        }

        if (password) {
            userUpdate.password = await bcrypt.hash(password, 10);
        }

        await User.findByIdAndUpdate(employee.userId, userUpdate);

        return res
            .status(200)
            .json({
                success: true,
                message: "Employee updated successfully",
            });

    } catch (error) {
        console.error("Error updating employee:", error.message);
        if (error.code === 11000) { // Error code 11000 = Duplicate Key Error
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Email already exists",
                });
        }
        return res
            .status(500)
            .json({
                success: false,
                message: "Error updating employee",
                error: error.message,
            });
    }
};

// Delete Employee
// DELETE /api/v1/employees/:id
export const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        const employee = await Employee.findById(id);

        if (!employee) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: "Employee not found",
                });
        }

        employee.isDeleted = true;
        employee.employeeStatus = "INACTIVE";
        await employee.save();

        return res
            .status(200)
            .json({
                success: true,
                message: "Employee deleted successfully",
            });
    } catch (error) {
        console.error("Error deleting employee:", error.message);
        return res
            .status(500)
            .json({
                success: false,
                message: "Error deleting employee",
                error: error.message,
            });
    }
};