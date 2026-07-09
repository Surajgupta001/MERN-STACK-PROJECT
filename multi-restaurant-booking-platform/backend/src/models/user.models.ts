import mongoose, { Schema } from "mongoose";
import { IUser } from "../../types/index.js";

const UserSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    phone: {
        type: String,
        minlength: 10,
        trim: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'owner'],
        default: 'user',
    },
}, {
    timestamps: true,
});

// Remove password when converting to JSON
UserSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete (ret as any).password;
        return ret;
    }
});

const UserModel = mongoose.model<IUser>('User', UserSchema);

export default UserModel;