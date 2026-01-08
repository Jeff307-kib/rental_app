import Post from './post.model.js';
import mongoose from 'mongoose'

const hostelSchema = new mongoose.Schema({
    genderType: {
        type: String,
        enum: ['male', 'female', 'mixed'],
        required: true
    },
    // how many people can live
    roomType: {
        type: Number
    },
    bathRoomType: {
        type: String,
    },
    accessories: [
        { // aircon,  ပန်ကာ ဘာညာ
            name: {
                type: String,
                required: [true, 'An accessory must have a name.']
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            description: String
        }
    ],
    rules: String
});

export const Hostel = Post.discriminator(
    "Hostel",
    hostelSchema
);