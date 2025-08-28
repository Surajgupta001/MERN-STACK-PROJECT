import jwt from 'jsonwebtoken';
import Blog from '../models/blogs.models.js';
import Comment from '../models/comment.models.js';
import main from '../config/gemini.js';

export const adminLogin = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (email != process.env.ADMIN_EMAIL || password != process.env.ADMIN_PASSWORD) {
            return res
            .status(401)
            .json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            { email }, 
            process.env.JWT_SECRET
        );

        return res
            .status(200)
            .json({
                success: true,
                token
            });

    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: "Internal server error"
            });
    }
};

export const getAllBlogsAdmin = async (req, res) => {
    try {

        const blogs = await Blog.find({}).sort({ createdAt: -1 });

        res
        .status(200)
        .json({
            success: true,
            message: "Blogs fetched successfully",
            blogs
        });

    } catch (error) {
        res
        .status(500)
        .json({
            success: false,
            message: "Failed to fetch blogs",
            error: error.message
        });
    }
};

export const getAllComments = async (req, res) => {
    try {

        const comments = await Comment.find({}).populate('blog').sort({ createdAt: -1 });
        res
        .status(200)
        .json({
            success: true,
            message: "Comments fetched successfully",
            comments
        });

    } catch (error) {
        res
        .status(500)
        .json({
            success: false,
            message: "Failed to fetch comments",
            error: error.message
        });
    }
};

export const getdashboard = async (req, res) => {
    try {

        const recentBlogs = await Blog.find({}).sort({createdAt: -1}).limit(5);
        const blogs = await Blog.countDocuments();
        const comments = await Comment.countDocuments();
        const drafts = await Blog.countDocuments({ isPublished: false });

        const dashboardData = {
            recentBlogs,
            blogs,
            comments,
            drafts
        }

        res
        .status(200)
        .json({
            success: true,
            message: "Dashboard data fetched successfully",
            dashboardData
        });

    } catch (error) {
        res
        .status(500)
        .json({
            success: false,
            message: "Failed to fetch dashboard data",
            error: error.message
        });
    }
};

export const deleteCommentById = async (req, res) => {
    try {

        const { id } = req.body;
        await Comment.findByIdAndDelete(id);

        res
        .status(200)
        .json({
            success: true,
            message: "Comment deleted successfully"
        });

    } catch (error) {
        res
        .status(500)
        .json({
            success: false,
            message: "Failed to delete comment",
            error: error.message
        });
    }
};

export const approveCommentById = async (req, res) => {
    try {
        const { id } = req.body;
        await Comment.findByIdAndUpdate(id, { isApproved: true });

        res
        .status(200)
        .json({
            success: true,
            message: "Comment approved successfully"
        });

    } catch (error) {
        res
        .status(500)
        .json({
            success: false,
            message: "Failed to approve comment",
            error: error.message
        });
    }
};