import { ApiModelProperty } from "@nestjs/swagger";
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested, IsDateString, IsDate } from "class-validator";

export class PlanTodo {
    @IsNotEmpty()
    text: string;

    @IsNotEmpty()
    @IsDate({ message: 'Due Date must be a valid date string' })
    @Type(() => Date)
    dueDate: Date;
}

export class CreateReqPlan {
    @IsNotEmpty({ message: 'messages.required' })
    @ApiModelProperty({ example: 'Photography and video' })
    planName: string;


    @ApiModelProperty({
        example: [
            { "text": "search for a photographer", "dueDate": "2019-12-20" }
        ]
    })
    @Type(() => PlanTodo)
    @ValidateNested({ each: true })
    planTodos: PlanTodo[];
}


