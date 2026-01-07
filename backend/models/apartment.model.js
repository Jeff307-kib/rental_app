import Post from './post.model.js';
import mongoose from 'mongoose'

const apartmentSchema = new mongoose.Schema({
    apartmentType: {
        type: String,
    },
    totalRooms: {
        type: Number,
        required: [true, 'Number of rooms is required.']
    },
    floor: {
        type: Number,
        required: [true, 'Floor Number is required.']
    },
    hasLift: {
        type: Boolean,
        required: [true, 'Has Lift is required.']
    },
    parking: [
        {
            vehicleType: {
                type: String,
                enum: ["Car", "Motorcycle"]
            },
            quantity: {
                type: Number,
                min: 1
            },
            description: {
                type: String
            }
        }
    ],
    electricity24: {
        type: Boolean,
        default: false
    }
});

export const Apartment = Post.discriminator(
    "Apartment",
    apartmentSchema
);