import fs from 'fs';
import imagekit from '../config/imageKit.js';
import Blog from '../models/blogs.models.js';
import Comment from '../models/comment.models.js';
import main from '../config/gemini.js';

export const addBlog = async (req, res) => {
    try {

        const { title, subTitle, description, category, isPublished } = JSON.parse(req.body.blog);

        const imageFile = req.file;

        // Check if all fields are present
        if (!title || !description || !category || !imageFile) {
            return res
            .status(400)
            .json({
                success: false,
                message: "Please provide all required fields"
            });
        }

        const fileBuffer = fs.readFileSync(imageFile.path);
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: '/blogs'
        });

        // Optimised through imagekit URL transformation
        const optimisedImageUrl = imagekit.url({
            path: response.filePath,
            transformation: [
                {
                    quality: 'auto' // Auto Compression
                },
                {
                    format: 'webp' // Convert to modern format
                },
                {
                    width: '1280' // Image Width
                }
            ]
        });

        const image = optimisedImageUrl;

        // Persist isPublished flag (default false if not provided)
        const savedBlog = await Blog.create({
            title,
            subTitle,
            description,
            category,
            image,
            isPublished: Boolean(isPublished)
        });

        res
        .status(201)
        .json({
            success: true,
            message: "Blog added successfully",
            blog: savedBlog
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to add blog",
            error: error.message
        });
    }
};

export const getAllBlogs = async (req, res) => {
    try {

        const blogs = await Blog.find({
            isPublished : true
        });

        res
        .status(200)
        .json({
            success: true,
            message: "Blogs fetched successfully",
            blogs
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch blogs",
            error: error.message
        });
    }
};

export const getBlogById = async (req, res) => {
    try {

    const { blogId } = req.params;

    const blog = await Blog.findById(blogId);

        if (!blog) {
            return res
            .status(404)
            .json({
                success: false,
                message: "Blog not found"
            });
        }

        res
        .status(200)
        .json({
            success: true,
            message: "Blog fetched successfully",
            blog
        });

    } catch (error) {
        res
        .status(500)
        .json({
            success: false,
            message: "Failed to get blog",
            error: error.message
        });
    }
};

export const deleteBlogById = async (req, res) => {
    try {

        const { id } = req.body;

        await Blog.findByIdAndDelete(id);

        // Delete associated comments
        await Comment.deleteMany({ blog: id });

        res
        .status(200)
        .json({
            success: true,
            message: "Blog deleted successfully"
        });

    } catch (error) {
        res
        .status(500)
        .json({
            success: false,
            message: "Failed to delete blog",
            error: error.message
        });
    }
};

export const togglePublish = async (req, res) => {
    try {

        const { id } = req.body;
        const blog = await Blog.findById(id);
        blog.isPublished = !blog.isPublished;
        await blog.save();

        res
        .status(200)
        .json({
            success: true,
            message: "Blog updated successfully",
            blog
        });

    } catch (error) {
        res
        .status(500)
        .json({
            success: false,
            message: "Failed to update blog",
            error: error.message
        });
    }
};

export const addComment = async (req, res) => {
    try {

        const { blog, name, content } = req.body;
        await Comment.create({
            blog,
            name,
            content
        });

        res
        .status(201)
        .json({
            success: true,
            message: "Comment added successfully"
        });

    } catch (error) {
        res
        .status(500)
        .json({
            success: false,
            message: "Failed to add comment",
            error: error.message
        });
    }
};

export const getBlogComment = async (req, res) => {
    try {

        const { blogId } = req.body;
        const comments = await Comment.find({
            blog: blogId,
            isApproved: true
        }).sort({
            createdAt: -1
        });

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

export const generateContent = async (req, res) => {
    try {

        const { prompt } = req.body;

        if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Prompt is required'
            });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(503).json({
                success: false,
                message: 'AI generation is not configured (missing GEMINI_API_KEY)'
            });
        }

        const content = await main(
            `${prompt}. Generate a blog content for this topic in simple text format.`
        );
        
        res
        .status(200)
        .json({
            success: true,
            message: "Content generated successfully",
            content
        });

    } catch (error) {
        res
        .status(500)
        .json({
            success: false,
            message: "Failed to generate content",
            error: error.message
        });
    }
};