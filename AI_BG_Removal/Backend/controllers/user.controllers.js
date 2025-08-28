import { Webhook } from "svix";
import User from "../models/user.models.js";

// API Controllers Functions to manage clerk user with database
// http://localhost:8080/api/user/webhooks
const clerkWebHooks = async (req, res) => {
    try {
        // Create a Svix instance with clerk without secret
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        });

        const { data, type } = req.body;

        switch (type) {
            case "user.created": {
                // Handle user created event
                const userData = {
                    clerkId: data.id,
                    email: data.email_addresses[0].email_address,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    photo: data.image_url,
                };

                // Save userData to your database
                await User.create(userData);
                // res
                // .status(200)
                // .json({
                //     success: true,
                //     message: "User created successfully",
                //     data: userData
                // });
                res.json({});

                break;
            }
            case "user.updated": {
                // Handle user updated event
                const userData = {
                    email: data.email_addresses[0].email_address,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    photo: data.image_url,
                };

                // Update userData in your database using clerkId filter
                await User.findOneAndUpdate({ clerkId: data.id }, userData, { new: true });
                res.json({});

                break;
            }
            case "user.deleted": {
                // Handle user deleted event
                await User.findOneAndDelete({ clerkId: data.id });
                res.json({});

                break;
            }
            default:
                console.warn("Unhandled Webhook type:", type);
        }
    } catch (error) {
        console.error("Error verifying Webhook:", error);
        res.status(400).json({
            success: false,
            error: "Webhook verification failed",
        });
    }
};

// API Controllers function to get user available credits data
const userCredits = async (req, res) => {
    try {

        const clerkId = req.clerkId || req.body?.clerkId;

        const userData = await User.findOne({ clerkId });

        const credits = typeof userData?.creditBalance === 'number' ? userData.creditBalance : 5;

        res
        .status(200)
        .json({
            success: true,
            message: "User credits retrieved successfully",
            credits
        })

    } catch (error) {
        console.error("Error retrieving user credits:", error);
        res
        .status(500)
        .json({
            success: false,
            error: "Failed to retrieve user credits",
        });
    }
};

export { 
    clerkWebHooks,
    userCredits
};