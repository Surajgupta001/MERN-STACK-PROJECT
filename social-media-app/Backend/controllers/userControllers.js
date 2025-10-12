import imageKit from "../config/imageKit.js";
import User from "../models/User.js";
import fs from "fs";

// Get User Data Using userId
export const getUserData = async (req, res) => {
    try {
        const { userId } = req.auth();
        const user = await User.findById(userId)
        if (!user) {
            return res
            .status(404)
            .json({
                success: false,
                message: 'User not found'
            })
        }

        res
        .status(200)
        .json({
            success: true,
            message: 'User data fetched successfully',
            user
        })

    } catch (error) {
        console.error('Error fetching user data:', error);
        return res
        .status(500)
        .json({
            success: false,
            message: error.message
        });
    }
};

// Update User Data
export const updateUserData = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { full_name, username, bio, location } = req.body;

        const tempUser = await User.findById(userId);

        !username && (username = tempUser.username);

        if (tempUser.username !== username) {
            const user = await User.findOne({ username });
            if (user) {
                // We Will not change the username if it is already taken
                username = tempUser.username;
            }
        } 

        const updatedData = {
            username,
            bio,
            location,
            full_name
        };

        const profile = req.files.profile && req.files.profile[0];
        const cover = req.files.cover && req.files.cover[0];

        if (profile) {
            const buffer = fs.readFileSync(profile.path);
            const response = await imageKit.upload({
                file: buffer,
                fileName: profile.originalname,
            })

            const url = imageKit.url({
                path: response.filePath,
                transformation: [
                    {quality: 'auto'},
                    {format: 'webp'},
                    {width: '512'}
                ]
            })
            updatedData.profile_picture = url;
        }

        if (cover) {
            const buffer = fs.readFileSync(cover.path);
            const response = await imageKit.upload({
                file: buffer,
                fileName: cover.originalname,
            })

            const url = imageKit.url({
                path: response.filePath,
                transformation: [
                    {quality: 'auto'},
                    {format: 'webp'},
                    {width: '1280'}
                ]
            })
            updatedData.cover_picture = url;
        }

        const user = await User.findByIdAndUpdate(userId, updatedData, { new: true });

        res
        .status(200)
        .json({
            success: true,
            message: 'User data updated successfully',
            user
        })
        
    } catch (error) {
        console.error('Error updating user data:', error);
        return res
        .status(500)
        .json({
            success: false,
            message: error.message
        });
    }
};

// Find Users using username, email, location, name
export const discoverUsers = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { input } = req.body();

        const allUsers = await User.find({
            $or: [
                { username: new RegExp(input, 'i') },
                { email: new RegExp(input, 'i') },
                { full_name: new RegExp(input, 'i') },
                { location: new RegExp(input, 'i') }
            ]
        });

        const filteredUsers = allUsers.filter(user => user._id !== userId);

        res
        .status(200)
        .json({
            success: true,
            message: 'Users fetched successfully',
            users: filteredUsers
        })

    } catch (error) {
        console.error('Error fetching users:', error);
        return res
        .status(500)
        .json({
            success: false,
            message: error.message
        });
    }
};

// Follow User
export const followUser = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { id } = req.body();

        const user = await User.findById(userId);

        if (user.following.includes(id)) {
            return res
            .status(400)
            .json({
                success: false,
                message: 'You are already following this user'
            })
        }

        user.following.push(id);
        await user.save();

        const toUser = await User.findById(id);
        toUser.followers.push(userId);
        await toUser.save();

        res
        .status(200)
        .json({
            success: true,
            message: 'Now you are following this user',
        })

    } catch (error) {
        console.error('Error following user:', error);
        return res
        .status(500)
        .json({
            success: false,
            message: error.message
        });
    }
};

// Follow User
export const unFollowUser = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { id } = req.body();

        const user = await User.findById(userId);
        user.following = user.following.filter(user => user !== id);
        await user.save();

        const toUser = await User.findById(id);
        toUser.followers = toUser.followers.filter(user => user !== userId);
        await toUser.save();

        res
        .status(200)
        .json({
            success: true,
            message: 'Unfollowed user successfully',
        })

    } catch (error) {
        console.error('Error following user:', error);
        return res
        .status(500)
        .json({
            success: false,
            message: error.message
        });
    }
};