import { IsNotEmpty } from "class-validator";

export class UpdateReqPlan {
    @IsNotEmpty({ message: 'messages.required' })
    planName: string;
}