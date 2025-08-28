import jwt from 'jsonwebtoken'

// user authentication middleware
const authUser = async (req, res, next) => {
    
    const { token } = req.headers
    
    if (!token) {
        
        return res
        .status(401)
        .json({
            success: false,
            message: 'Not Authorized Login Again'
        });
    }
    
    try {
        
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        
        if (!req.body) {
            req.body = {}
        }
        req.body.userId = token_decode.id

        // Proceed to the next middleware or route handler
        next()

    } catch (error) {
        console.log(error)
        res
        .status(401)
        .json({
            success: false,
            message: error.message
        });
    }
}

export default authUser;