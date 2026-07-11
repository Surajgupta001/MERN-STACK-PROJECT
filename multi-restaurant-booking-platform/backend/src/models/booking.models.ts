import mongoose from "mongoose";
import { IBooking } from "../../types/index.js";
import crypto from "crypto";

const bookingSchema = new mongoose.Schema<IBooking>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    guests: {
        type: Number,
        required: true,
        min: 1
    },
    occasion: {
        type: String,
        trim: true
    },
    specialRequests: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['confirmed', 'cancelled', 'completed'],
        default: 'confirmed'
    },
    bookingId: {
        type: String,
        unique: true,
    }
}, {
    timestamps: true
});

// Auto-generate reference code on save
bookingSchema.pre<IBooking>('save', function () {
    if (!this.bookingId) {
        this.bookingId = `GR-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    }
});

const BookingModel = mongoose.model<IBooking>('Booking', bookingSchema);

export default BookingModel;