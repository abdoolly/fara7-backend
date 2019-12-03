import { Schema } from "mongoose";
import { ReqPlan } from "./ReqPlan";
let ObjectId = Schema.Types.ObjectId;

export const MarriageReq = new Schema({
    collaborators: {
        type: [ObjectId],
        index: true
    },
    req_plans: {
        type: [ReqPlan]
    }
});