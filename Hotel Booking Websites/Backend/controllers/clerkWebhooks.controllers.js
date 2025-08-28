import { Webhook } from "svix";
import User from "../models/user.models.js";

const clerkWebhooks = async (req, res) => {
    try {
        // Create a Svix instance with clerk webhook secret
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        // Getting Header
        const headers = {
            'svix-id': req.headers['svix-id'],
            'svix-timestamp': req.headers['svix-timestamp'],
            'svix-signature': req.headers['svix-signature'],
        };

        // Getting data from request body
        const { data, type } = req.body;

        const userData = {
            _id: data.id,
            email: data.email_addresses[0].email_address,
            username: data.first_name + " " + data.last_name,
            image: data.image_url,
        };

        // Switch Case for different webhook events
        switch (type) {
            case "user.created":
                // Handle user created event
                await User.create(userData);
                break;
            case "user.updated":
                // Handle user updated event
                await User.findByIdAndUpdate(data.id, userData);
                break;
            case "user.deleted":
                // Handle user deleted event
                await User.findByIdAndDelete(data.id);
                break;
            default:
                // Handle unknown event type
                console.log("Unknown event type");
                break;
        }

        res.status(200).json({
            success: true,
            message: "Webhook processed successfully"
        })

    } catch (error) {
        console.error("Error processing webhook:", error);
        res.status(500).json({
            success: false,
            message: "Error processing webhook"
        });
    }
};

export default clerkWebhooks;