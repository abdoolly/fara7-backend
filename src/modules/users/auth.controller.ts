import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { ApiOkResponse } from '@nestjs/swagger';
import { Model } from 'mongoose';
import { I18n, I18nService } from 'nestjs-i18n';
import { Public } from '../../helpers/decorators/Public';
import { LoginRequest } from './interfaces/LoginRequest';
import { RegisterRequest } from './interfaces/RegisterRequest';
import { User } from './interfaces/Schemas.interface';
import { Models } from '../../helpers/Models';

@Controller('/auth')
export class AuthController {

    constructor(
        @InjectModel(Models.User) private readonly UserModel: Model<User>,
        private readonly jwtService: JwtService,
    ) { }

    @Public()
    @Post('/register')
    async register(@Body() data: RegisterRequest, @I18n() i18n: I18nService) {
        let user = await this.UserModel.create(data);

        return {
            message: i18n.translate('messages.success.register'),
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
    async login(@Body() { username, password }: LoginRequest, @I18n() i18n: I18nService): Promise<any> {
        let user = await this.UserModel.findOne({ username, password });

        if (!user)
            throw new UnauthorizedException(i18n.translate('messages.wrong_creds'));

        return {
            message: i18n.translate('messages.success.login'),
            token: await this.jwtService.signAsync(user.toJSON()),
            user: {
                username: user.username,
                name: user.name
            }
        };
    }
}
