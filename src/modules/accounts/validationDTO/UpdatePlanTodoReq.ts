import { IsMongoId, IsNotEmpty } from "class-validator";

export class UpdatePlanTodoParams {
    @IsNotEmpty()
    reqPlanId: string;

    @IsNotEmpty()
    planTodoId: string;
}