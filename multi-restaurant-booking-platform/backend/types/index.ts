import { Document, Types } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: 'user' | 'admin' | 'owner';
    createdAt: Date;
    updatedAt: Date;
}

export interface IRestaurant extends Document {
    name: string;
    slug: string;
    description: string;
    cuisine: string;
    priceRange: "$" | "$$" | "$$$" | "$$$$";
    rating: number;
    reviewCount: number;
    location: string;
    address: string;
    image: string;
    chef: string;
    tags: string[];
    availableSlots: string[];
    featured: boolean;
    exclusive: boolean;
    owner: Types.ObjectId;
    status: 'pending' | 'approved' | 'rejected';
    totalSeats: number;
    createdAt: Date;
    updatedAt: Date;
};

export interface IBooking extends Document {
    user: Types.ObjectId;
    restaurant: Types.ObjectId;
    date: Date;
    time: string;
    guests: number;
    occasion?: string;
    specialRequests?: string;
    status: 'confirmed' | 'cancelled' | 'completed';
    bookingId: string;
    createdAt: Date;
    updatedAt: Date;
};