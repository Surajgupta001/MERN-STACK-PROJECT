import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';

// Generate JWT token
export const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET!, {
        expiresIn: '30d'
    });
};

// helper function to upload bufffer to cloudinary
export const uploadToCloudinary = (fileBuffer: Buffer) : Promise<{ secure_url: string }> => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'restaurant-booking' },
            (error, result) => {
                if (error) return reject(error);
                if (!result) return reject(new Error('No result from Cloudinary'));
                resolve({ secure_url: result.secure_url });
            }
        )
        stream.end(fileBuffer);
    })
};