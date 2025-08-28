import express from 'express';
import { bookAppointment, cancelAppointment, getProfile, listAppointment, loginUser, paymentRazorpay, registerUser, updateProfile, verifyRazorpay } from '../controllers/user.contorllers.js';
import authUser from '../middlewares/auth.user.js';
import upload from '../middlewares/multer.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

userRouter.get('/get-profile', authUser, getProfile);
userRouter.post('/update-profile', upload.single('image'), authUser, updateProfile);
userRouter.post('/book-appointment', authUser, bookAppointment);
userRouter.get('/appointments', authUser, listAppointment);
userRouter.post('/cancel-appointment', authUser, cancelAppointment);
userRouter.post('/razorpay-payment', authUser, paymentRazorpay);
userRouter.post('/verify-razorpay', authUser, verifyRazorpay);

export default userRouter;