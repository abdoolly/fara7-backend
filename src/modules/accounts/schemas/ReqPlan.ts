import { Schema } from 'mongoose';
import { PlanTodo } from './PlanTodo';
let ObjectId = Schema.Types.ObjectId;

export const ReqPlanSchema = new Schema({
    marriage_req_id: { type: ObjectId, index: true },
    planName: String,
    planTodos: {
        type: [PlanTodo]
    }
});