import { ApiModelProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UpdateMarriageReq {
    @IsNotEmpty()
    @ApiModelProperty({ example: '5de7d63cae5bd22e57c76b59' })
    marriageReqId: string;

    @ApiModelProperty()
    @IsNotEmpty()
    @ApiModelProperty({
        example: {
            name: "Wedding-1"
        }
    })
    data: any;
}