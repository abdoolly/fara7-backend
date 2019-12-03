import * as mongoose from 'mongoose';

export const PlanTodo = new mongoose.Schema({
    text: String,
    dueDate: Date
});