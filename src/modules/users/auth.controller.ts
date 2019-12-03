import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { ApiOkResponse } from '@nestjs/swagger';
import { Model } from 'mongoose';
import { Public } from '../../helpers/decorators/Public';
import { LoginRequest } from './interfaces/LoginRequest';
import { RegisterRequest } from './interfaces/RegisterRequest';
import { User } from './interfaces/Schemas.interface';
import { AccountsService } from '../accounts/accounts.service';
import { ObjectId } from 'mongodb';
import { I18nLang } from 'nestjs-i18n';

@Controller('/auth')
export class AuthController {

    constructor(
        @InjectModel('User') private readonly UserModel: Model<User>,
        private readonly jwtService: JwtService,
        private readonly accountService: AccountsService
    ) { }

    @Public()
    @Post('/register')
    async register(@Body() data: RegisterRequest) {
        let user = await this.UserModel.create(data);

        // initiating the user account data
        this.accountService.initiateAccount(new ObjectId(user._id));

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
