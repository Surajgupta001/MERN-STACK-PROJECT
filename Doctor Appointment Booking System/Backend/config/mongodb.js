import mongoose from 'mongoose';

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const connectDB = async () => {
    const uri = process.env.MONGODB_URI;
    const dbName = process.env.DB_NAME || 'doctor_booking';
    const maxRetries = parseInt(process.env.MONGODB_MAX_RETRIES || '5', 10);

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            await mongoose.connect(uri, {
                dbName,
                serverSelectionTimeoutMS: 5000,
                connectTimeoutMS: 5000,
            });
            console.log(
                `MongoDB connected successfully. Host: ${mongoose.connection.host}`
            );
            return true;
        } catch (error) {
            console.error(
                `MongoDB connection failed (attempt ${attempt}/${maxRetries}):`,
                error?.message || error
            );

            // If not last attempt, backoff and retry
            if (attempt < maxRetries) {
                const backoff = Math.min(1000 * 2 ** (attempt - 1), 10000); // 1s,2s,4s,8s,10s
                console.log(`Retrying MongoDB connect in ${backoff}ms...`);
                await sleep(backoff);
                continue;
            }

            console.error(
                'MongoDB connection failed after maximum retries. The API will continue to run, but DB-dependent endpoints may fail until connectivity is restored.'
            );
            return false;
        }
    }
};

export default connectDB;
