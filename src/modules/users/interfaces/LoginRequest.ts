import { Injectable } from '@nestjs/common';
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

//TODO: localization
@Injectable()
export class LoginRequest {
    @ApiModelProperty({ example: 'abdoolly' })
    @IsNotEmpty({ message: 'messages.no_username' })
    readonly identifier: String;

    @ApiModelProperty({ example: '123456789' })
    @IsNotEmpty({ message: 'messages.no_password' })
    readonly password: string;
}