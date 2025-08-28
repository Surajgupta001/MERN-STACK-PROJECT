import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.models.js";
import User from "../models/user.models.js";
import { io, userSocketMap } from "../server.js";

// Get users for sidebar.
export const getUserForSidebar = async (req, res) => {
    try {
        const userId = req.user._id;
        const includeSelf = req.query.includeSelf === 'true';

        const userFilter = includeSelf ? {} : { _id: { $ne: userId } };
        const filteredUsers = await User.find(userFilter).select("-password");

        // Count number of unseen messages (messages sent FROM each user TO me that I haven't seen yet)
        const unSeenMessages = {};
        const promises = filteredUsers.map(async (user) => {
            if (String(user._id) === String(userId)) return; // skip self for unseen count
            const messages = await Message.find({
                receiverId: userId,
                senderId: user._id,
                seen: false
            });
            if (messages.length > 0) {
                unSeenMessages[user._id] = messages.length;
            }
        });
        await Promise.all(promises);

        res
        .status(200)
        .json({
            success: true,
            message: "Users fetched successfully",
            users: filteredUsers,
            unSeenMessages
        });
        
    } catch (error) {
        console.error(error);
        res
        .status(500)
        .json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Get All Messages for selected User
export const getMessages = async (req, res) => {
    try {

        const { id: selectedUserId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { 
                    senderId: myId, 
                    receiverId: selectedUserId 
                },
                { 
                    senderId: selectedUserId, 
                    receiverId: myId 
                }
            ]
        })
        await Message.updateMany({
            $or: [
                { 
                    senderId: selectedUserId, 
                    receiverId: myId 
                },
                { 
                    senderId: myId, 
                    receiverId: selectedUserId 
                }
            ]
        }, { 
            seen: true 
        });

        res
        .status(200)
        .json({
            success: true,
            message: "Messages fetched successfully",
            messages
        });

    } catch (error) {
        console.error(error);
        res
        .status(500)
        .json({
            success: false,
            message: "Internal server error"
        });
    }
};

// API to mark messages as seen using messages id
export const markMessagesAsSeen = async (req, res) => {
    try {

        const { id } = req.params;

        await Message.findByIdAndUpdate(
            id, 
            { 
                seen: true 
            }
        );

        res
        .status(200)
        .json({
            success: true,
            message: "Message marked as seen"
        });

    } catch (error) {
        res
        .status(500)
        .json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
};

// Send messages to selected user
export const sendMessage = async (req, res) => {
    try {

        const { text, image } = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = await Message.create({
            text,
            image: imageUrl,
            senderId,
            receiverId
        })

        // Emit the new messages to the receivers's sockets
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage);
        }

        res
        .status(201)
        .json({
            success: true,
            message: "Message sent successfully",
            newMessage
        })
        
    } catch (error) {
        res
        .status(500)
        .json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
};