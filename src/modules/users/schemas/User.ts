import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    name: String,
    password: String
});