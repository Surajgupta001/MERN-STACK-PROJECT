import jwt from 'jsonwebtoken';

const protect = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res
        .status(401)
        .json({
            success: false,
            message: "No token provided, authorization denied"
        })
    }
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decode.userId;
        req.user = decode.userId;
        next();
    } catch (error) {
        return res
        .status(401)
        .json({
            success: false,
            message: "Invalid token, authorization denied"
        })
    }
};

export default protect;