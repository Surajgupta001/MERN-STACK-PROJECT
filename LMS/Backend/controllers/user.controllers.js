import Course from "../models/course.models.js";
import Purchase from "../models/purchase.models.js";
import User from "../models/user.models.js";
import stripe from 'stripe';

// Get User Data
export const getUserData = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const user = await User.findById(userId)

        if (!user) {
            return res
            .status(404)
            .json({
                success: false,
                message: "User not found"
            })
        }

        res
        .status(200)
        .json({
            success: true,
            message: "User data fetched successfully",
            user
        });

    } catch (error) {
        res
        .status(500)
        .json({
            success: false,
            message: error.message
        });
    }
};

// Users Enrolled Courses with Lecture links
export const userEnrolledCourses = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const userData = await User.findById(userId).populate('enrolledCourses');

        res
        .status(200)
        .json({
            success: true,
            message: "User enrolled courses fetched successfully",
            enrolledCourses: userData.enrolledCourses
        });
        
    } catch (error) {
        res
        .status(500)
        .json({
            success: false,
            message: error.message
        });
    }
};

// Purchase Course
export const purchaseCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const { origin } = req.headers;
        const userId = req.auth.userId;
        const userData = await User.findById(userId);
        const courseData = await Course.findById(courseId);

        if (!userData || !courseData) {
            return res
            .status(404)
            .json({
                success: false,
                message: "User or Course not found"
            })
        }

        const purchaseData = {
            courseId: courseData._id,
            userId,
            amount: (courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2)
        }

        const newPurchase = new Purchase(purchaseData);

        // Stripe Gateway initialization
        const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);
        const currency = process.env.CURRENCY.toLowerCase();

        // Creating line items for stripe
        const line_items = [{
            price_data: {
                currency,
                product_data: {
                    name: courseData.courseTitle,
                },
                unit_amount: Math.floor(newPurchase.amount) * 100
            },
            quantity: 1
        }]

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-enrollments`,
            cancel_url: `${origin}/`,
            line_items: line_items,
            mode: 'payment',
            metadata: {
                purchaseId: newPurchase._id.toString()
            }
        })

        res
        .status(200)
        .json({
            success: true,
            message: "Stripe session created successfully",
            session_url : session.url
        });
    } catch (error) {
        res
        .status(500)
        .json({
            success: false,
            message: error.message
        })
    }
};