import { PlanTodo } from "./PlanTodo";
import { Document } from "mongoose";

export interface ReqPlan extends Document {
    marriage_req_id: string;
    text: String,
    planTodos: PlanTodo[]
}