import { Router } from "express";
import { clockInOut, getAttendance } from "../controllers/attendance.controllers";
import { protect } from "../middlewares/auth";

const attendanceRouter = Router();

attendanceRouter.post('/', protect, clockInOut);
attendanceRouter.get('/', protect, getAttendance);

export default attendanceRouter;