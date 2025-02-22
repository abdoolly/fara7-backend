import { Document } from 'mongoose';

export interface User extends Document {
    email?: string;
    phone?: string;
    name?: string;
    password?: string;
}