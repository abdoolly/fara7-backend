import { Document } from 'mongoose';

export interface User extends Document {
    username: string;
    name: string;
    password: string;
}