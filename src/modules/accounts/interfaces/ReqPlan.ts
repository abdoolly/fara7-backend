import { Document } from "mongoose";

export interface ReqPlan {
    marriage_req_id?: string;
    planName: String,
    cost: Number;
    dueDate: Date;
    note?: string;
    done?: Boolean;
}

export interface ReqPlanDoc extends Document { }
export interface ReqPlanDoc extends ReqPlan { }