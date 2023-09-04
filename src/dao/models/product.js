import mongoose from 'mongoose';

const productCollection = 'productos';

const productSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, //////////VER SI FUNCIONA
    title: String,
    description: String,
    price: Number,
    status: Boolean,
    thumbnail: String,
    code: {
        type: String,
        unique: true
    },
    stock: Number
});

export const productModel = mongoose.model(productCollection, productSchema);
