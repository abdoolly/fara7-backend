import { ApiModelProperty } from "@nestjs/swagger";
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested, IsDateString, IsDate, IsNumber, IsOptional } from "class-validator";

export class PlanTodo {
    @ApiModelProperty()
    @IsNotEmpty()
    text: string;

    @ApiModelProperty()
    @IsNotEmpty()
    @IsDate({ message: 'Due Date must be a valid date string' })
    @Type(() => Date)
    dueDate: Date;
}

export class CreateReqPlan {
    @IsNotEmpty({ message: 'messages.required' })
    @ApiModelProperty({ example: 'Photography and video' })
    planName: string;

    @IsNotEmpty({ message: 'messages.required' })
    @IsNumber({}, { message: 'Cost must be a number' })
    @ApiModelProperty({ example: 20 })
    cost: Number;

    @IsNotEmpty({ message: 'messages.required' })
    @Type(() => Date)
    @IsDate()
    dueDate: Date;

    @IsOptional()
    @IsNotEmpty({ message: 'messages.required' })
    note: string;

    // @ApiModelProperty({
    //     example: [
    //         { "text": "search for a photographer", "dueDate": "2019-12-20" }
    //     ]
    // })
    // @Type(() => PlanTodo)
    // @ValidateNested({ each: true })
    // planTodos: PlanTodo[];
}


