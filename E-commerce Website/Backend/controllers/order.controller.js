import OrderModel from '../models/order.model.js';
import UserModel from '../models/user.model.js';
import Stripe from 'stripe';
import Razorpay from 'razorpay';

// Global variable
const currency = 'INR'; // Default currency for payments
const deliveryCharges = 10; // Example delivery charges, can be modified as needed

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_API_KEY);

// Initialize Razorpay with your secret key and Id
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Placing orders using Cash On Delivery (COD) method
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: 'COD',
            payment: false,
            date: Date.now(),
        };

        const newOrder = new OrderModel(orderData);
        await newOrder.save();

        await UserModel.findByIdAndUpdate(userId, {
            cartData: {},
        });

        res.status(200).json({
            success: true,
            message: 'Order Placed Successfully',
            order: newOrder,
        });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to place order',
            error: error.message,
        });
    }
};

// Placing orders using Stripe Method
const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const { origin } = req.headers;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: 'Stripe',
            payment: false,
            date: Date.now(),
        };

        const newOrder = new OrderModel(orderData);
        await newOrder.save();

        const line_items = items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100, // Stripe expects amount in cents
            },
            quantity: item.quantity,
        }));

        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: 'Delivery Charges',
                },
                unit_amount: deliveryCharges * 100, // Example delivery charge
            },
            quantity: 1,
        });

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items: line_items,
            mode: 'payment',
        });

        res.status(200).json({
            success: true,
            message: 'Order placed successfully',
            session_url: session.url,
        });
    } catch (error) {
        console.error('Error placing order with Stripe:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to place order with Stripe',
            error: error.message,
        });
    }
};

// verify Stripe
const verifyStripe = async (req, res) => {
    const { orderId, success, userId } = req.body;

    try {
        if (success == 'true') {
            await OrderModel.findByIdAndUpdate(orderId, {
                payment: true,
            });

            await UserModel.findByIdAndUpdate(userId, {
                cartData: {},
            });

            res.status(200).json({
                success: true,
                message: 'Order placed successfully',
            });
        } else {
            await OrderModel.findByIdAndDelete(orderId);
            res.status(400).json({
                success: false,
                message: 'Order placement failed',
            });
        }
    } catch (error) {
        console.error('Error verifying Stripe order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to verify Stripe order',
            error: error.message,
        });
    }
};

// Placing orders using Razorpay Method
const placeOrderRazorpay = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: 'Razorpay',
            payment: false,
            date: Date.now(),
        };

        const newOrder = new OrderModel(orderData);
        await newOrder.save();

        const options = {
            amount: amount * 100, // Amount in paise
            currency: currency.toUpperCase(),
            receipt: newOrder._id.toString(),
        };

        // Use promise-based Razorpay order creation
        const order = await razorpayInstance.orders.create(options);

        res.status(200).json({
            success: true,
            message: 'Order placed successfully',
            order: order,
        });
    } catch (error) {
        console.error('Error placing order with Razorpay:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to place order with Razorpay',
            error: error.message,
        });
    }
};

// Vefifying Razorpay payment
const verifyRazorpay = async (req, res) => {
    try {
        const { userId, razorpay_order_id } = req.body;

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
        // console.log('Razorpay Order Info:', orderInfo);

        if (orderInfo.status === 'paid') {
            await OrderModel.findByIdAndUpdate(orderInfo.receipt, {
                payment: true,
            });

            await UserModel.findByIdAndUpdate(userId, {
                cartData: {},
            });

            res.status(200).json({
                success: true,
                message: 'Order placed successfully',
            });
        } else {
            await OrderModel.findByIdAndDelete(orderInfo.receipt);
            res.status(400).json({
                success: false,
                message: 'Order placement failed',
            });
        }
    } catch (error) {
        console.error('Error verifying Razorpay order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to verify Razorpay order',
            error: error.message,
        });
    }
};

// All Orders data for Admin panel
const allOrders = async (req, res) => {
    try {
        const orders = await OrderModel.find({});

        res.status(200).json({
            success: true,
            message: 'All orders fetched successfully',
            orders: orders,
        });
    } catch (error) {
        console.error('Error fetching all orders:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch all orders',
            error: error.message,
        });
    }
};

// User Order Data for Frontend
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;

        const orders = await OrderModel.find({
            userId: userId,
        });

        res.status(200).json({
            success: true,
            message: 'User orders fetched successfully',
            orders: orders,
        });
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user orders',
            error: error.message,
        });
    }
};

// Updating Order Status from Admin panel
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        await OrderModel.findByIdAndUpdate(orderId, {
            status: status,
        });

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update order status',
            error: error.message,
        });
    }
};

// Exporting all functions
export {
    placeOrder,
    placeOrderStripe,
    placeOrderRazorpay,
    allOrders,
    userOrders,
    updateStatus,
    verifyStripe,
    verifyRazorpay,
};
