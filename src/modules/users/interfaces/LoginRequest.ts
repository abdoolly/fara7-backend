import { Injectable } from '@nestjs/common';
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

//TODO: localization
@Injectable()
export class LoginRequest {
    @ApiModelProperty({ example: 'abdoolly' })
    @IsString()
    readonly username: String;

    @ApiModelProperty({ example: '123456789' })
    @IsNotEmpty()
    @IsString()
    readonly password: string;
}