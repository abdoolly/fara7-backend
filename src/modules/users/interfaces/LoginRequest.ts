import { IsNotEmpty, IsString, ValidationArguments } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

//TODO: localization
export class LoginRequest {
    @ApiModelProperty({ example: 'abdoolly' })
    @IsString()
    readonly username: String;

    @ApiModelProperty({ example: '123456789' })
    @IsNotEmpty()
    @IsString()
    readonly password: string;
}