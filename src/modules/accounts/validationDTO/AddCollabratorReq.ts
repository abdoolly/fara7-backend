import { IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class AddCollabratorReq {
    @IsNotEmpty({ message: 'messages.no_username' })
    @ApiModelProperty({ example: 'testusername' })
    username: string;

    @IsNotEmpty({ message: 'messages.required' })
    @ApiModelProperty({ example: '5de7d63cae5bd22e57c76b59' })
    marriageReqId: string;
}