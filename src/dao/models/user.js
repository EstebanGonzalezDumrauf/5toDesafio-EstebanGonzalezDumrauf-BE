import mongoose from 'mongoose';

const userCollection = 'users';

const userSchema = new mongoose.Schema({
    user: String,
    pass: String,
    isAdmin: {
        type: Boolean,
        default: false
    },
    rol: {
        type: String,
        default: "usuario"
    },
    nombre: String,
    apellido: String
});

export const userModel = mongoose.model(userCollection, userSchema);