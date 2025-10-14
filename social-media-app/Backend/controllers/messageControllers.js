import fs from 'fs';
import imageKit from '../config/imageKit.js';
import Message from '../models/Message.js';

// Create an empty object to store Server Side Event connections
const connections = {};

// Controllers for Server Side Event Endpoint
export const sseController = (req, res) => {
    const { userId } = req.params;
    console.log('New Client Connected: ', userId);

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Add the client's Response object to the connections object
    connections[userId] = res;

    // Send an initial event to SSE client
    res.write('log: Connected to SSE stream\n\n');

    // Handle client disconnect
    req.on('close', () => {
        // Remove the client's Response object from the connections object
        delete connections[userId];
        console.log('Client Disconnected: ', userId);
    });
};

// Send Message
export const sendMessage = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { to_user_id, text } = req.body;
        const image = req.file;

        let media_url = '';
        let Message_type = image ? 'image' : 'text';

        if (Message_type === 'image') {
            const fileBuffer = fs.readFileSync(image.path);
            const response = await imageKit.upload({
                file: fileBuffer,
                fileName: image.originalname,
            });
            media_url = imageKit.url({
                path: response.filePath,
                transformation: [
                    { quality: 'auto' },
                    { format: 'webp' },
                    { width: '1280' }
                ]
            })
        }

        const message = await Message.create({
            from_user_id: userId,
            to_user_id,
            text,
            message_type: Message_type,
            media_url
        })

        res
        .status(201)
        .json({
            success: true,
            message: 'Message Sent Successfully',
            message
        })

        // Send message to to_user_id using SSE
        const messageWithUserData = await Message.findById(message._id).populate('from_user_id');

        if (connections[to_user_id]) {
            connections[to_user_id].write(`data: ${JSON.stringify(messageWithUserData)}\n\n`);
        }
        
    } catch (error) {
        console.error('Error sending message:', error);
        res
        .status(500)
        .json({
            success: false,
            message: error.message
        })
    }
};

// Get Chat Messages
export const getChatMessages = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { to_user_id } = req.body;
        
        const messages = await Message.find({
            $or: [
                { from_user_id: userId, to_user_id },
                { from_user_id: to_user_id, to_user_id: userId }
            ]
        }).sort({ createdAt: 1 })

        // Mark messages as seen
        await Message.updateMany({
            from_user_id: to_user_id,
            to_user_id: userId,
            seen: true
        });

        res
        .status(200)
        .json({
            success: true,
            message: 'Messages Fetched Successfully',
            messages
        })

    } catch (error) {
        console.error('Error getting messages:', error);
        res
        .status(500)
        .json({
            success: false,
            message: error.message
        })
    }
};

export const getUserRecentMessages = async (req, res) => {
    try {
        const { userId } = req.auth();
        const messages = await Message.find({
            to_user_id: userId
        }).populate('from_user_id to_user_id').sort({ createdAt: -1 });
        
        res
        .status(200)
        .json({
            success: true,
            message: 'Recent Messages Fetched Successfully',
            messages
        });
        
    } catch (error) {
        console.error('Error getting recent messages:', error);
        res
        .status(500)
        .json({
            success: false,
            message: error.message
        })
    }
};