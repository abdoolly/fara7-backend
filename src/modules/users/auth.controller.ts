import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { ApiOkResponse } from '@nestjs/swagger';
import { Model } from 'mongoose';
import { Public } from '../../helpers/decorators/Public';
import { LoginRequest } from './interfaces/LoginRequest';
import { RegisterRequest } from './interfaces/RegisterRequest';
import { User } from './interfaces/Schemas.interface';

@Controller('/auth')
export class AuthController {

    constructor(
        @InjectModel('User') private readonly UserModel: Model<User>,
        public jwtService: JwtService
    ) { }

    @Public()
    @Post('/register')
    async register(@Body() data: RegisterRequest) {
        let user = await this.UserModel.create(data);

        // TODO: localization
        return {
            message: 'Registered Successfully',
            token: await this.jwtService.signAsync(user.toJSON()),
            user: {
                username: user.username,
                name: user.name
            }
        };
    }

    @Public()
    @Post('/login')
    @ApiOkResponse({ description: 'Successful login' })
    async login(@Body() { username, password }: LoginRequest): Promise<any> {

        let user = await this.UserModel.findOne({ username, password });

        if (!user)
            throw new UnauthorizedException('Wrong username or password');

        return {
            // TODO: localization
            message: 'logged in successfully',
            token: await this.jwtService.signAsync(user.toJSON()),
            user: {
                username: user.username,
                name: user.name
            }
        };
    }
}
