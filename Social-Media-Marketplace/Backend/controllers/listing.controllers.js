import imagekit from "../configs/imageKit.js";
import prisma from "../configs/prisma.js";
import fs from 'fs';

// Controllers to adding Listing to Database
export const addListing = async (req, res) => {
    try {
        const { userId } = await req.auth();
        if (req.plan !== 'premium') {
            const listingCount = await prisma.listing.count({
                where: {
                    ownerId: userId
                }
            });
            if (listingCount >= 5) {
                return res
                    .status(403)
                    .json({
                        success: false,
                        message: 'Listing limit reached for free plan'
                    });
            }
        }

        const accountDetails = JSON.parse(req.body.accountDetails);

        // Normalize incoming payload keys from client
        if (accountDetails.engagment_rate !== undefined && accountDetails.engagement_rate === undefined) {
            accountDetails.engagement_rate = accountDetails.engagment_rate;
            delete accountDetails.engagment_rate;
        }
        if (accountDetails.mentized !== undefined && accountDetails.monetized === undefined) {
            accountDetails.monetized = accountDetails.mentized;
            delete accountDetails.mentized;
        }

        // Coerce numeric fields safely
        if (accountDetails.followers_count !== undefined)
            accountDetails.followers_count = parseFloat(accountDetails.followers_count);
        if (accountDetails.engagement_rate !== undefined)
            accountDetails.engagement_rate = parseFloat(accountDetails.engagement_rate);
        if (accountDetails.monthly_views !== undefined)
            accountDetails.monthly_views = parseFloat(accountDetails.monthly_views);
        if (accountDetails.price !== undefined)
            accountDetails.price = parseFloat(accountDetails.price);

        // Normalize casing for enums
        if (typeof accountDetails.platform === 'string')
            accountDetails.platform = accountDetails.platform.toLowerCase();
        if (typeof accountDetails.niche === 'string')
            accountDetails.niche = accountDetails.niche.toLowerCase();

        if (typeof accountDetails.username === 'string' && accountDetails.username.startsWith('@')) {
            accountDetails.username = accountDetails.username.slice(1);
        }

        const uplaodImages = req.files.map(async (file) => {
            const response = await imagekit.files.upload({
                file: fs.createReadStream(file.path),
                fileName: `${Date.now()}.png`,
                folder: 'flip-earn',
                transformation: {
                    pre: 'w-1280, h-auto'
                }
            });
            return response.url;
        });

        // Wait for all uploads to complete
        const images = await Promise.all(uplaodImages);

        const listing = await prisma.listing.create({
            data: {
                ownerId: userId,
                images,
                ...accountDetails
            }
        })

        return res
            .status(201)
            .json({
                success: true,
                message: 'Listing created successfully',
                listing
            });
    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: error.code || error.message
            });
    }
};

// Controller for getting All Public Listings
export const getAllPublishListings = async (req, res) => {
    try {
        const listings = await prisma.listing.findMany({
            where: {
                status: 'active'
            },
            include: {
                owner: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        if (!listings || listings.length === 0) {
            return res.json({
                success: true,
                message: 'No listings found',
                listings: []
            })
        };

        return res.json({
            success: true,
            message: 'Listings fetched successfully',
            listings
        });
    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: error.code || error.message
            });
    }
};

// Controllers for getting all user Listing
export const getAllUserListings = async (req, res) => {
    try {
        const { userId } = await req.auth();
        // Get all listings expect deleted
        const listings = await prisma.listing.findMany({
            where: {
                ownerId: userId,
                status: {
                    not: 'deleted'
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        const balance = {
            earned: user.earned,
            withdrawn: user.withdrawn,
            available: user.earned - user.withdrawn
        }

        if (!listings || listings.length === 0) {
            return res.json({
                success: true,
                message: 'No listings found',
                listings: [],
                balance
            })
        }

        return res.json({
            success: true,
            message: 'Listings fetched successfully',
            listings,
            balance
        });
    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: error.code || error.message
            });
    }
};

// Controller for updating Listing in Database
export const updateListing = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const accountDetails = JSON.parse(req.body.accountDetails);

        // Normalize incoming payload keys from client
        if (accountDetails.engagment_rate !== undefined && accountDetails.engagement_rate === undefined) {
            accountDetails.engagement_rate = accountDetails.engagment_rate;
            delete accountDetails.engagment_rate;
        }
        if (accountDetails.mentized !== undefined && accountDetails.monetized === undefined) {
            accountDetails.monetized = accountDetails.mentized;
            delete accountDetails.mentized;
        }

        if (req.files.length + accountDetails.images.length > 5) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: 'You can upload a maximum of 5 images per listing'
                })
        };

        if (accountDetails.followers_count !== undefined)
            accountDetails.followers_count = parseFloat(accountDetails.followers_count);
        if (accountDetails.engagement_rate !== undefined)
            accountDetails.engagement_rate = parseFloat(accountDetails.engagement_rate);
        if (accountDetails.monthly_views !== undefined)
            accountDetails.monthly_views = parseFloat(accountDetails.monthly_views);
        if (accountDetails.price !== undefined)
            accountDetails.price = parseFloat(accountDetails.price);
        if (typeof accountDetails.platform === 'string')
            accountDetails.platform = accountDetails.platform.toLowerCase();
        if (typeof accountDetails.niche === 'string')
            accountDetails.niche = accountDetails.niche.toLowerCase();

        if (typeof accountDetails.username === 'string' && accountDetails.username.startsWith('@')) {
            accountDetails.username = accountDetails.username.slice(1);
        }

        const listing = await prisma.listing.update({
            where: {
                id: accountDetails.id,
                ownerId: userId
            },
            data: accountDetails
        });

        if (!listing) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: 'Listing not found'
                });
        };

        if (listing.status === 'sold') {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "You can't update a sold listing"
                });
        };

        if (req.files.length > 0) {
            const uplaodImages = req.files.map(async (file) => {
                const response = await imagekit.files.upload({
                    file: fs.createReadStream(file.path),
                    fileName: `${Date.now()}.png`,
                    folder: 'flip-earn',
                    transformation: {
                        pre: 'w-1280, h-auto'
                    }
                });
                return response.url;
            });

            // Wait for all uploads to complete
            const images = await Promise.all(uplaodImages);

            const listing = await prisma.listing.update({
                where: {
                    id: accountDetails.id,
                    ownerId: userId
                },
                data: {
                    ownerId: userId,
                    ...accountDetails,
                    images: [...accountDetails.images, ...images]
                }
            });

            return res
                .status(200)
                .json({
                    success: true,
                    message: 'Listing updated successfully',
                    listing
                });
        };

        return res
            .status(200)
            .json({
                success: true,
                message: 'Listing updated successfully',
                listing
            });
    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: error.code || error.message
            });
    }
};

// Controller for toogle the Listing status
export const togglesatatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = await req.auth();

        // Find by unique id only, then verify ownership
        const listing = await prisma.listing.findUnique({
            where: { id }
        });

        if (!listing) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: 'Listing not found'
                });
        };

        if (listing.ownerId !== userId) {
            return res
                .status(403)
                .json({
                    success: false,
                    message: 'Not authorized to update this listing'
                });
        }

        if (listing.status === 'active' || listing.status === 'inactive') {
            const updated = await prisma.listing.update({
                where: { id },
                data: {
                    status: listing.status === 'active' ? 'inactive' : 'active'
                }
            });
            return res
                .status(200)
                .json({
                    success: true,
                    message: 'Listing status updated successfully',
                    listing: updated
                });
        } else if (listing.status === 'ban') {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "You can't change the status of a banned listing"
                });
        } else if (listing.status === 'sold') {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "You can't change the status of a sold listing"
                });
        }

        // Fallback (should not reach here for valid statuses)
        return res.status(200).json({ success: true, message: 'No status change performed', listing });
    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: error.code || error.message
            });
    }
};

// Controller for deleting Listing from Database
export const deleteListing = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const { listingId } = req.params;

        // Fetch the listing first to validate ownership and status
        const listing = await prisma.listing.findUnique({
            where: { id: listingId }
        });

        if (!listing) {
            return res.status(404).json({ success: false, message: 'Listing not found' });
        }

        if (listing.ownerId !== userId) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this listing' });
        }

        if (listing.status === 'sold') {
            return res.status(400).json({ success: false, message: "You can't delete a sold listing" });
        }

        // Optional: notify owner if credentials changed (omitted here)

        // Hard delete cascade: remove related messages, platform messages, chats, credentials, transactions, then the listing
        const chats = await prisma.chat.findMany({
            where: { listingId }
        });
        const chatIds = chats.map((c) => c.id);

        await prisma.$transaction([
            // Delete messages tied to chats
            prisma.message.deleteMany({ where: { chatId: { in: chatIds } } }),
            prisma.platformMessage.deleteMany({ where: { chatId: { in: chatIds } } }),
            // Delete chats for this listing
            prisma.chat.deleteMany({ where: { listingId } }),
            // Delete credentials for this listing
            prisma.credential.deleteMany({ where: { listingId } }),
            // Delete transactions tied to this listing
            prisma.transaction.deleteMany({ where: { listingId } }),
            // Finally delete the listing itself
            prisma.listing.delete({ where: { id: listingId } })
        ]);

        return res.status(200).json({ success: true, message: 'Listing permanently deleted' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.code || error.message });
    }
};

// Controller for adding credential in our listing
export const addCredential = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const { listingId, credentials } = req.body;

        if (!listingId || !credentials || (Array.isArray(credentials) && credentials.length === 0)) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: 'Missing Fields'
                });
        };

        const listing = await prisma.listing.findUnique({ where: { id: listingId } });

        if (!listing) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: 'Listing not found or you are not the owner'
                });
        };

        if (listing.ownerId !== userId) {
            return res
                .status(403)
                .json({
                    success: false,
                    message: 'Not authorized to add credentials for this listing'
                });
        }

        // Normalize to Json[] as per schema
        const originalCredential = Array.isArray(credentials) ? credentials : [credentials];

        await prisma.credential.create({
            data: {
                listingId,
                originalCredential
            }
        });

        await prisma.listing.update({
            where: {
                id: listingId
            },
            data: {
                isCredentialSubmitted: true
            }
        });

        return res
            .status(200)
            .json({
                success: true,
                message: 'Credential added successfully'
            });
    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: error.code || error.message
            });
    }
};

// Controller to mark listing as featured
export const markFeatured = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = await req.auth();

        if (req.plan !== 'premium') {
            return res
                .status(403)
                .json({
                    success: false,
                    message: 'Only premium users can feature listings'
                });
        };

        // Ensure the listing exists and belongs to the current user
        const listing = await prisma.listing.findUnique({ where: { id } });
        if (!listing) {
            return res
            .status(404)
            .json({ 
                success: false, 
                message: 'Listing not found' 
            });
        }
        if (listing.ownerId !== userId) {
            return res
            .status(403)
            .json({ 
                success: false, 
                message: 'Not authorized to feature this listing' 
            });
        }

        // Unset all other featured listing
        await prisma.listing.updateMany({
            where: {
                ownerId: userId,
            },
            data: {
                featured: false
            }
        });

        // mark the listing as featured
        await prisma.listing.update({
            where: {
                id
            },
            data: {
                featured: true
            }
        });

        return res
            .status(200)
            .json({
                success: true,
                message: 'Listing marked as featured successfully'
            });
    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: error.code || error.message
            });
    }
};

// Controllers to Get all user order 
export const getAlluserorder = async (req, res) => {
    try {
        const { userId } = await req.auth();
        let orders = await prisma.transaction.findMany({
            where: {
                userId,
                isPaid: true
            },
            include: {
                listing: true
            }
        });

        if (!orders || orders.length === 0) {
            return res.json({
                success: true,
                message: 'No orders found',
                orders: []
            })
        };

        // Attach the credential to each order
        const credentials = await prisma.credential.findMany({
            where: {
                listingId: {
                    in: orders.map(order => order.listingId)
                }
            }
        });

        const ordersWithCredentials = orders.map((order) => {
            const credential = credentials.find((cred) => cred.listingId === order.listingId);
            return {
                ...order,
                credential
            };
        });

        return res
            .status(200)
            .json({
                success: true,
                message: 'Orders fetched successfully',
                orders: ordersWithCredentials
            });
    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: error.code || error.message
            });
    }
};

// Controllers to withdraw amount
export const withdrawAmount = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const { amount, account } = req.body;

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        const balance = user.earned - user.withdrawn;

        if (amount > balance) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: 'Insufficient balance'
                });
        }

        const withdrawal = await prisma.withdrawal.create({
            data: {
                userId,
                amount,
                account
            }
        });

        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                withdrawn: { 
                    increment: amount 
                }
            }
        });

        return res
            .status(200)
            .json({
                success: true,
                message: 'Withdrawal request submitted successfully',
                withdrawal
            });
    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: error.code || error.message
            });
    }
};

// Controller to purchase amount
export const purchaseAmount = async (req, res) => {

};