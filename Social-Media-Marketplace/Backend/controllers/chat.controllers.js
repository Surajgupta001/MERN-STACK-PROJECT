import prisma from "../configs/prisma.js";

// Controller for getting Chat (Creating if not exists)
export const getChat = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const { listingId, chatId } = req.body;

        const listing = await prisma.listing.findUnique({
            where: {
                id: listingId
            }
        });

        if (!listing) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: 'Listing not found'
                })
        }

        // Find Existing Chat
        let existingChat = null;
        if (chatId) {
            existingChat = await prisma.chat.findFirst({
                where: {
                    id: chatId,
                    OR: [{
                        chatUserId: userId
                    }, {
                        ownerUserId: userId
                    }]
                },
                include: {
                    listing: true,
                    chatUser: true,
                    ownerUser: true,
                    messages: true
                }
            })
        } else {
            existingChat = await prisma.chat.findFirst({
                where: {
                    listingId,
                    chatUserId: userId,
                    ownerUserId: listing.ownerId
                },
                include: {
                    listing: true,
                    chatUser: true,
                    ownerUser: true,
                    messages: true
                }
            })
        }

        if (existingChat) {
            res.json({
                success: true,
                message: 'Chat fetched successfully',
                chat: existingChat
            });

            if (existingChat.isLastMessageRead === false) {
                const lastMessages = existingChat.messages[existingChat.messages.length - 1];
                const isLastMessageSendByMe = lastMessages.sender_id === userId;

                if (isLastMessageSendByMe) {
                    await prisma.chat.update({
                        where: {
                            id: existingChat.id
                        },
                        data: {
                            isLastMessageRead: true
                        }
                    })
                }
            }
            return null;
        }

        const newChat = await prisma.chat.create({
            data: {
                listingId,
                chatUserId: userId,
                ownerUserId: listing.ownerId
            }
        });

        const chatWithData = await prisma.chat.findUnique({
            where: {
                id: newChat.id
            },
            include: {
                listing: true,
                chatUser: true,
                ownerUser: true,
            }
        });

        return res
            .status(201)
            .json({
                success: true,
                message: 'Chat created successfully',
                chat: chatWithData
            })
    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: error.code || error.message
            })
    }
};

// Controller to get all chats of a user
export const getAllUserChats = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const chats = await prisma.chat.findMany({
            where: {
                OR: [{
                    chatUserId: userId
                }, {
                    ownerUserId: userId
                }]
            },
            include: {
                listing: true,
                chatUser: true,
                ownerUser: true,
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });

        if (!chats || chats.length === 0) {
            return res
                .json({
                    chat: []
                })
        }

        return res
            .json({
                success: true,
                message: 'Chats fetched successfully',
                chats
            })
    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: error.code || error.message
            })
    }
};

export const sendChatMessage = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const { chatId, message } = req.body;
        const chat = await prisma.chat.findFirst({
            where: {
                AND: [{
                    id: chatId,
                    OR: [
                        { chatUserId: userId },
                        { ownerUserId: userId }
                    ]
                }]
            },
            include: {
                listing: true,
                chatUser: true,
                ownerUser: true,
            }
        });

        if (!chat) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: 'Chat not found'
                })
        } else if (chat.listing.status !== 'active') {
            return res
                .status(400)
                .json({
                    success: false,
                    message: `Listing is ${chat.listing.status}, cannot send message`
                })
        }

        const newMessageData = {
            message,
            sender_id: userId,
            chatId,
            createdAt: new Date()
        };

        const createdMessage = await prisma.message.create({
            data: newMessageData
        });

        res.json({
            success: true,
            message: 'Message sent successfully',
            messageObject: createdMessage
        })

        await prisma.chat.update({
            where: {
                id: chatId
            },
            data: {
                lastMessage: createdMessage.message,
                isLastMessageRead: false,
                lastMessageSenderId: userId,
            }
        });
    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: error.code || error.message
            })
    }
};