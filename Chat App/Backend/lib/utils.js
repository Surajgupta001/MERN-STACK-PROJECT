import jwt from 'jsonwebtoken';

// Creating token user can authenticate
export const generateToken = (userId) => {
    const token = jwt.sign(
        {
            userId
        },
        process.env.JWT_SECRET
    );
    return token;
};