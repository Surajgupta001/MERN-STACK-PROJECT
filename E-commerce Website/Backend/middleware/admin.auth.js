import jwt from 'jsonwebtoken';

const adminAuth = (req, res, next) => {
    try {
        const { token } = req.headers;
        
        if(!token) {
            return res
            .status(401)
            .json({
                success: false,
                message: 'Access denied, no token provided'
            });
        }

        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if(tokenDecode != process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res
            .status(403)
            .json({
                success: false,
                message: 'Unauthorized access, invalid token'
            });
        }
        next();
    }
    catch (error) {
        console.log(error);
        res
        .status(500)
        .json({
            success: false,
            message: 'Server error, please try again later'
        });
    }
}

export default adminAuth;
