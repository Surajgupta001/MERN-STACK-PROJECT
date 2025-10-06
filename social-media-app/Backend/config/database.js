import mongoose from "mongoose";

let connecting = false;

const connectDB = async () => {
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    if (mongoose.connection.readyState === 1) return;
    if (connecting || mongoose.connection.readyState === 2) return;

    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is not defined');
    }

    const uri = `${process.env.MONGODB_URI}/pingup`;

    try {
        connecting = true;
        await mongoose.connect(uri);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        throw error; // propagate so callers know it failed
    } finally {
        connecting = false;
    }
};

export default connectDB;