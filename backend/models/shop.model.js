import Post from './post.model.js';
import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema({
    hasStorage: {
        type: Boolean,
        default: false
    }
});

export const Shop = Post.discriminator(
    "Shop",
    shopSchema
);