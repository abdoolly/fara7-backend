import { IsNotEmpty, MaxLength } from "class-validator";
import { ApiModelProperty } from "@nestjs/swagger";

export class CreateMarriageReq {
    @IsNotEmpty({ message: 'messages.no_name' })
    @ApiModelProperty({ example: 'Wedding' })
    name: string;
}