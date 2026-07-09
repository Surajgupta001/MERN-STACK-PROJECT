import jwt from 'jsonwebtoken';

// Generate JWT token
export const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET!, {
        expiresIn: '30d'
    });
};