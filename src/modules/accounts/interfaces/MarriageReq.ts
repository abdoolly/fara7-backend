import { Document } from "mongoose";

export interface MarriageReq extends Document {
    owner_id: string;
    collaborators: string[],
    en_name: string,
    ar_name: string,   // use the en_name and ar_name if this is a 
    // template then we should have a translation for the naming

    name: string,     // use this as the default assuming the user will be creating his own category
}