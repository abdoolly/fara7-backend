import { Schema } from 'mongoose';
import { MarriageReq } from './MarriageReq';
let ObjectId = Schema.Types.ObjectId;

export const AccountSchema = new Schema({
    owner: {
        type: ObjectId, // should be a ref id to the user 
        index: true
    },
    collaborators: {
        type: [ObjectId],
        index: true
    },
    marriage_reqs: {
        type: [MarriageReq],
    }
});