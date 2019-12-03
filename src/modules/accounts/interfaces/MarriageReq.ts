import { ReqPlan } from "./ReqPlan";

export interface MarriageReq {
    collaborators: string[],
    req_plans: ReqPlan[]
}