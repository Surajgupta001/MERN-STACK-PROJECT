import mongoose from 'mongoose';

// Function to connect to the MongoDB database
export const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => 
            console.log('MongoDB connected successfully')
        );
        await mongoose.connect(`${process.env.MONGODB_URI}`);
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
};