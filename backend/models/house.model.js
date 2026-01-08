import Post from './post.model.js';
import mongoose from 'mongoose';

const houseSchema = new mongoose.Schema({
    floors: {
        type: Number,
        min: 1,
        default: 1
    }, //ဘယ်နှစ်ထပ်လဲ

    yardAvailable: { // ခြံဝင်းပါလား
        type: Boolean,
        default: false
    },
    totalRooms: {
        type: Number,
        required: [true, 'A house must have room numbers.']
    },
    houseType: {
        type: String
    }
})

export const House = Post.discriminator(
    "House",
    houseSchema
);