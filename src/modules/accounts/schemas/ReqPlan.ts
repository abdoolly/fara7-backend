import * as mongoose from 'mongoose';
import { PlanTodo } from './PlanTodo';

export const ReqPlan = new mongoose.Schema({
    planTodos: {
        type: [PlanTodo]
    }
});