import { Schema, model, models } from "mongoose";

export interface IUser {
    clerkId: string;
    email: string;
    username: string;
    photo: string;
    firstName?: string; // Optional property
    lastName?: string; // Optional property
    planId: number; //  defaults to 1
    creditBalance: number; // defaults to 0
}

const UserSchema = new Schema({
    clerkId: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    photo: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    planId: {
        type: Number,
        default: 1,
    },
    creditBalance: {
        type: Number,
        default: 10,
    },
});

const User = models?.User || model('User', UserSchema)
export default User