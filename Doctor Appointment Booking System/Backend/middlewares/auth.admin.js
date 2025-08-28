import jwt from 'jsonwebtoken';

// Admin Authentication Middleware
const authAdmin = (req, res, next) => {
    try {
        
        const { atoken } = req.headers;
        if (!atoken) {
            return res
            .status(401)
            .json({ 
                success: false, 
                message: "No token provided for authentication" 
            });
        }

        // Verify the token
        const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);

        if (token_decode != process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res
            .status(401)
            .json({ 
                success: false, 
                message: "Invalid token" 
            });
        }
        // If token is valid, proceed to the next middleware or route handler
        next();

    } catch (error) {
        console.error("Authentication Error:", error);
        return res
        .status(401)
        .json({ 
            success: false, 
            message: "Unauthorized" 
        });
        
    }
};

export default authAdmin;
