import imageKit from "../config/imageKit.js";
import User from "../models/user.models.js";
import fs from 'fs';

// Get User Data using userId
export const getUserData = async (req, res) => {
    try {
        
        const authData = typeof req.auth === 'function' ? await req.auth() : {};
        const userId = authData?.userId || authData?.user_id || req.user?.id || req.params.userId || req.query.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized: userId not found' });
        }

        const user = await User.findById(userId).lean();
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.status(200).json({ success: true, user });

    } catch (error) {
        console.error('Error getting user data:', error);
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
        
        const { userId } = await req.auth();
        let { username, full_name, bio, location } = req.body || {};
        const tempUser = await User.findById(userId);
        if (!tempUser) return res.status(404).json({ success: false, message: 'User not found' });
        if (!username) username = tempUser.username;
        if (username !== tempUser.username) {
            const userWithSame = await User.findOne({ username });
            if (userWithSame) username = tempUser.username; // keep existing
        }
        const updatedData = { username, full_name, bio, location };

    const profile = req.files?.profile?.[0];
    const cover = req.files?.cover?.[0];

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
            });

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
            });

            // Schema field is cover_photo
            updatedData.cover_photo = url;
        }

        const user = await User.findByIdAndUpdate(
            userId,
            updatedData,
            { new: true }
        );

        res
        .status(200)
        .json({
            success: true,
            message: 'Profile updated successfully',
            user
        });

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
        
        const { userId } = await req.auth();

        const { input } = req.body || {};
        if (!input || !input.trim()) {
            return res.status(200).json({ success: true, users: [], message: 'No input provided' });
        }

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
            users: filteredUsers,
            message: 'Users discovered successfully'
        });

    } catch (error) {
        console.error('Error discovering users:', error);
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
        
        const { userId } = await req.auth();

    const { id } = req.body || {};
    if (!id) return res.status(400).json({ success: false, message: 'Target user id required' });

        const user = await User.findById(userId);

        if (user.following.includes(id)) {
            return res
            .status(400)
            .json({
                status: false,
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
            message: 'Now you are following this user'
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

// Unfollow User
export const unfollowUser = async (req, res) => {
    try {
        
        const { userId } = await req.auth();

    const { id } = req.body || {};
    if (!id) return res.status(400).json({ success: false, message: 'Target user id required' });

        const user = await User.findById(userId);

        user.following = user.following.filter(user => user != id);
        await user.save();

        const toUser = await User.findById(id);
        toUser.followers = toUser.followers.filter(user => user != userId);
        await toUser.save();

        res
        .status(200)
        .json({
            success: true,
            message: 'You have unfollowed this user'
        })

    } catch (error) {
        console.error('Error unfollowing user:', error);
        return res
        .status(500)
        .json({
            success: false,
            message: error.message
        });
    }
};