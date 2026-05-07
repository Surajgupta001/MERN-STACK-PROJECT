import 'dotenv/config';
import connectDB from './config/database.js';
import User from './models/user.models.js';
import bcrypt from 'bcrypt';

const TemporaryPassword = 'admin123';

async function registerAdmin() {
    try {
        const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

        if (!ADMIN_EMAIL) {
            console.error('ADMIN_EMAIL is not defined in .env file');
            process.exit(1);
        }

        await connectDB();

        const existingAdmin = await User.findOne({
            email: process.env.ADMIN_EMAIL
        });

        if (existingAdmin) {
            console.log('Admin user already exists with email:', existingAdmin.role);
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(TemporaryPassword, 10);

        const admin = await User.create({
            email: process.env.ADMIN_EMAIL,
            password: hashedPassword,
            role: 'ADMIN'
        });

        console.log('Admin user created successfully with email:');
        console.log('\nEmail:', admin.email);
        console.log('Temporary Password:', TemporaryPassword);
        console.log('\nPlease change the temporary password after first login.');

        process.exit(0);
    } catch (error) {
        console.error('Seed failed', error);
    }
};

registerAdmin();