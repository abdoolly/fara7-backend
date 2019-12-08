import { Schema } from "mongoose";
let ObjectId = Schema.Types.ObjectId;

export const MarriageReqSchema = new Schema({
    owner_id: { type: ObjectId, index: true }, // object id referring to the users _id
    collaborators: {
        type: [ObjectId],
        index: true
    },
    name: { type: String, unique: true },     // use this as the default assuming the user will be creating 
    en_name: String,
    ar_name: String,   // use the en_name and ar_name if this is a 
    // template then we should have a translation for the naming
});

