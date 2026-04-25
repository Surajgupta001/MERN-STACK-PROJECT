export const protect = async (req, res, next) => {
    try {
        const { userId, has } = await req.auth();

        if (!userId) {
            return res
            .status(401)
            .json({
                success: false,
                message: 'Unauthorized' 
            });
        }
        const hasPremiumPlan = await has({plan: 'premium'});
        req.plan = hasPremiumPlan ? 'premium' : 'free';
        next();

    } catch (error) {
        return res
        .status(500)
        .json({
            success: false,
            message: error.code || error.message
        });
    }
};