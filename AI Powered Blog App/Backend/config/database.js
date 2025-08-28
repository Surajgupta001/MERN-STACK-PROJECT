import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {
            console.log("MongoDB connected Successfully");
        });
        const uri = process.env.MONGO_URI;
        // Log the target database name for easier debugging
        try {
            const dbName = uri.split('/').pop();
            console.log(`Connecting to MongoDB database: ${dbName}`);
        } catch (e) {
            // ignore parsing errors
        }
        await mongoose.connect(uri);
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
    }
};

export default connectDB;
