import { ApiModelProperty } from "@nestjs/swagger";
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from "class-validator";
import { PlanTodo } from "./CreateReqPlan";

export class AddPlanTodo {

    @ApiModelProperty({
        example: [
            { "text": "search for a photographer", "dueDate": "2019-12-20" }
        ]
    })
    @Type(() => PlanTodo)
    @IsArray()
    @ValidateNested({ each: true })
    planTodos: PlanTodo[]
}