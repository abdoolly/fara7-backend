import { IsMongoId, IsNotEmpty } from "class-validator";
import { ApiModelProperty } from "@nestjs/swagger";

export class UpdatePlanTodoParams {
    @ApiModelProperty()
    @IsNotEmpty()
    reqPlanId: string;

    @ApiModelProperty()
    @IsNotEmpty()
    planTodoId: string;
}