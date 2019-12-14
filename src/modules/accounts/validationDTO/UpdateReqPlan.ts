import { IsNotEmpty } from "class-validator";
import { ApiModelProperty } from "@nestjs/swagger";

export class UpdateReqPlan {
    @ApiModelProperty()
    @IsNotEmpty({ message: 'messages.required' })
    planName: string;
}