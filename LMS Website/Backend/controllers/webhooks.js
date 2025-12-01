import { Webhook } from 'svix';
import User from '../models/user.models.js';

// API Controller function to manage Clerk User with database

export const clerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        await whook.verify(JSON.stringify(req.body), {
            'svix-id': req.headers['svix-id'],
            'svix-timestamp': req.headers['svix-timestamp'],
            'svix-signature': req.headers['svix-signature']
        });

        const { data, type } = req.body;

        switch (type) {
            case 'user.created': {
                // Handle user created event
                const userData = {
                    _id: data.id,
                    name: data.first_name + ' ' + data.last_name,
                    email: data.email_address[0].email_address,
                    imageUrl: data._image_url,
                }
                await User.create(userData);
                res.json({})
                break;
            }
            case 'user.updated': {
                // Handle user updated event
                const userData = {
                    name: data.first_name + ' ' + data.last_name,
                    email: data.email_address[0].email_address,
                    imageUrl: data._image_url,
                }
                await User.findByIdAndUpdate(data.id, userData);
                res.json({})
                break;
            }
            case 'user.deleted': {
                // Handle user deleted event
                await User.findByIdAndDelete(data.id);
                res.json({})
                break;
            }

            default:
                break;
        }
    } catch (error) {
        console.error('Error handling Clerk webhook:', error);
        res
        .status(400)
        .json({
            message: error.message
        })
    }
};