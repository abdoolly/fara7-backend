import { Body, Controller, Post, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';
import { LoginRequest } from './interfaces/LoginRequest';
import { RegisterRequest } from './interfaces/RegisterRequest';
import { User } from './interfaces/Schemas.interface';

@Controller('/auth')
export class AuthController {

    constructor(@InjectModel('User') private readonly UserModel: Model<User>) { }

    @Post('/register')
    async register(@Body() data: RegisterRequest) {
        let user = await this.UserModel.create(data);
        return { message: 'User Created Successfully', user };
    }

    @Post('/login')
    async login(@Req() req: Request, @Body() data: LoginRequest): Promise<string> {
        console.log('data', data);
        return 'hello world this is the login route';
    }
}
