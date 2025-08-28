import express from 'express';
import { appointmentCancel, appointmentComplete, appointmentsDoctor, doctorDashboard, doctorList, doctorProfile, loginDoctor, updateDoctorProfile } from '../controllers/doctor.controllers.js';
import authDoctor from '../middlewares/auth.doctors.js';

const doctorRouter = express.Router();

doctorRouter.get('/list', doctorList);
doctorRouter.post('/login', loginDoctor);
doctorRouter.get('/appointments', authDoctor, appointmentsDoctor);
doctorRouter.post('/complete-appointment', authDoctor, appointmentComplete);
doctorRouter.post('/cancel-appointment', authDoctor, appointmentCancel);
doctorRouter.get('/dashboard', authDoctor, doctorDashboard);
doctorRouter.get('/profile', authDoctor, doctorProfile);
doctorRouter.post('/update-profile', authDoctor, updateDoctorProfile);

export default doctorRouter;