import OpenAI from "openai";
import sql from "../config/database.js";
import { clerkClient } from "@clerk/express";
import axios from "axios";
import { v2 as cloudinary } from 'cloudinary';

const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export const generateArticles = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { prompt, length } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        if (plan != 'premium' && free_usage >= 10) {
            return res
                .status(403)
                .json({
                    success: false,
                    message: "Free usage limit exceeded. Please upgrade to premium plan."
                })
        }

        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [{
                role: "user",
                content: prompt,
            },
            ],
            temperature: 0.7,
            max_tokens: length,
        });

        const content = response.choices[0].message.content;

        await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'article')`;

        if (plan != 'premium') {
            await clerkClient.users.updateUser(userId, {
                privateMetadata: { free_usage: free_usage + 1 }
            });
        }

        res
            .status(200)
            .json({
                success: true,
                message: "Article generated successfully",
                content
            })

    } catch (error) {
        console.error("Error generating article:", error);
        res.status(500).json({
            success: false,
            message: "Error generating article"
        });
    }
};

export const generateBlogTitle = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { prompt } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        if (plan != 'premium' && free_usage >= 10) {
            return res
                .status(403)
                .json({
                    success: false,
                    message: "Free usage limit exceeded. Please upgrade to premium plan."
                })
        }

        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [{
                role: "user",
                content: prompt,
            },
            ],
            temperature: 0.7,
            max_tokens: 100,
        });

        const content = response.choices[0].message.content;

        await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'blog-title')`;

        if (plan != 'premium') {
            await clerkClient.users.updateUser(userId, {
                privateMetadata: { free_usage: free_usage + 1 }
            });
        }

        res
            .status(200)
            .json({
                success: true,
                message: "Blog title generated successfully",
                content
            })

    } catch (error) {
        console.error("Error generating blog title:", error);
        res.status(500).json({
            success: false,
            message: "Error generating blog title"
        });
    }
};

export const generateImage = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { prompt, publish } = req.body;
        const plan = req.plan;

        if (plan != 'premium') {
            return res
            .status(403)
            .json({
                success: false,
                message: "Image generation is available for premium plan users only."
            })
        }

        const formData = new FormData()
        formData.append('prompt', prompt);
        const { data } = axios.post('https://clipdrop-api.co/text-to-image/v1', formData, {
            headers: {
                'x-api-key': process.env.CLIPDROP_API_KEY,
            },
            responseType: 'arraybuffer'
        })

        const base64Image = `data:image/png;base64,${Buffer.from(data, 'binary').toString('base64')}`

        const { secure_url } = await cloudinary.uploader.upload(base64Image);

        await sql`INSERT INTO creations (user_id, prompt, content, type, publish) VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false} )`;

        res
            .status(200)
            .json({
                success: true,
                message: "Image generated successfully",
                content: secure_url
            })

    } catch (error) {
        console.error("Error generating image:", error);
        res.status(500).json({
            success: false,
            message: "Error generating image"
        });
    }
};