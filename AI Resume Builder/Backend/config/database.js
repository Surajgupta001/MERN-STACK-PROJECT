import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log('MongoDB connected Successfully');
        });
        let MongodbURI = process.env.MONGODB_URI;
        const projectName ='resume-builder';

        if (!MongodbURI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        if (MongodbURI.endsWith('/')) {
            MongodbURI = MongodbURI.slice(0, -1);
        }

        await mongoose.connect(`${MongodbURI}/${projectName}`);
    } catch (error) {
        console.error('MongoDB connection failed', error);
    }
};

export default connectDB;
