import { IsNotEmpty, IsString, ValidationArguments } from 'class-validator';

export class LoginRequest {
    @IsString()
    @IsString()
    readonly username: String;

    @IsNotEmpty()
    @IsString()
    readonly password: string;
}