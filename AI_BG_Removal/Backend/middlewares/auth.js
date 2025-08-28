import jwt from 'jsonwebtoken';

// Middleware to extract the Clerk user id (clerkId) from a JWT.
// Accepts either `Authorization: Bearer <token>` or a custom `token` header.
const authUser = async (req, res, next) => {
    try {
        let token = req.headers.token;

        const authHeader = req.headers.authorization || req.headers.Authorization;
        if (!token && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring('Bearer '.length);
        }

        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        const payload = jwt.decode(token);
        // Clerk JWTs typically use `sub` as the user id. Fall back to common aliases.
        const clerkId = payload?.sub || payload?.clerkId || payload?.userId;

        if (!clerkId) {
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }

        // Attach to request for downstream handlers (avoid mutating req.body on GET)
        req.clerkId = clerkId;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

export default authUser;