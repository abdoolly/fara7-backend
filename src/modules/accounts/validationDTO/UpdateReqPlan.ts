import { IsNotEmpty, IsOptional, IsDate, IsNumber, IsBoolean } from "class-validator";
import { ApiModelProperty } from "@nestjs/swagger";
import { Type } from 'class-transformer';

export class UpdateReqPlan {
    @IsOptional()
    @IsNotEmpty({ message: 'messages.required' })
    @ApiModelProperty({ example: 'Photography and video' })
    planName: string;

    @IsOptional()
    @IsNotEmpty({ message: 'messages.required' })
    @IsNumber({}, { message: 'Cost must be a number' })
    @ApiModelProperty({ example: 20 })
    cost: Number;

    @IsOptional()
    @IsNotEmpty({ message: 'messages.required' })
    @Type(() => Date)
    @IsDate()
    dueDate: Date;

    @IsOptional()
    @IsNotEmpty({ message: 'messages.required' })
    note: string;

    @IsOptional()
    @IsBoolean({ message: 'this field should be a boolean' })
    done: Boolean;
}