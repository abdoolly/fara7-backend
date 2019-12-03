import { MarriageReq } from "./MarriageReq";
import { Document } from 'mongoose';

export interface Account extends Document {
    owner: String,
    collaborators: string[],
    marriage_reqs: MarriageReq[]
}
