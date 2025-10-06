import { Inngest } from "inngest";
import User from "../models/user.models.js";
import connectDB from "../config/database.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "pingup-app" });

// Inngest Function to save user data to a database
const syncUserCreation = inngest.createFunction(
    {
        id: 'sync-user-from-clerk'
    },
    {
        event: 'clerk/user.created',
    },
    async ({ event }) => {
        await connectDB();

        const { id, first_name, last_name, email_addresses, image_url } = event.data;
        
        let username = email_addresses[0].email_address.split('@')[0];

        // Check availability of username
        const user = await User.findOne({ username });

        if (user) {
            // Append random number to username if already taken
            username = username + Math.floor(Math.random() * 1000);
        }

        // Prepare user data to be saved
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            full_name: first_name + ' ' + last_name,
            profile_picture: image_url,
            username
        };

        // Create user in database to match Clerk user
        await User.create(userData);
    }
);

// Create an empty array where we'll export future Inngest functions
const syncUserUpdation = inngest.createFunction(
    {
        id: 'update-user-from-clerk'
    },
    {
        event: 'clerk/user.updated',
    },
    async ({ event }) => {
        await connectDB();

        const { id, first_name, last_name, email_addresses, image_url } = event.data;

        const updateUserdate = {
            email: email_addresses[0].email_address,
            full_name: first_name + ' ' + last_name,
            profile_picture: image_url
        }

        await User.findByIdAndUpdate(id, updateUserdate);
    }
);

// Inngest Function to delete user from database
const syncUserDeletion = inngest.createFunction(
    {
        id: 'delete-user-from-clerk'
    },
    {
        event: 'clerk/user.deleted',
    },
    async ({ event }) => {
        await connectDB();

        const { id } = event.data;

        await User.findByIdAndDelete(id);
    }
);

// Create an empty array where we'll export future Inngest functions
export const functions = [
    syncUserCreation,
    syncUserUpdation,
    syncUserDeletion
];