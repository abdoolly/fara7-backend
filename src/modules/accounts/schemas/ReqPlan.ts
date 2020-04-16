import { Schema } from 'mongoose';
let ObjectId = Schema.Types.ObjectId;

export const ReqPlanSchema = new Schema({
    marriage_req_id: { type: ObjectId, index: true },
    planName: String,
    cost: { type: Number },
    dueDate: Date,
    done: { type: Boolean, default: false },
    note: String
    // planTodos: {
    //     type: [PlanTodo]
    // }
});