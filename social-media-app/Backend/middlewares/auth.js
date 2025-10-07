export const protect = async (req, res, next) => {
    try {
        const { userId } = await req.auth();
        if (!userId) {
            return res
            .status(401)
            .json({
                success: false,
                message: 'Not authorized, token failed'
            })
        }

        next();

    } catch (error) {
        return res
        .status(401)
        .json({
            success: false,
            message: error.message
        })
    }
};