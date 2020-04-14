import { BadRequestException, Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { ApiOkResponse, ApiUseTags } from '@nestjs/swagger';
import { Validator } from 'class-validator';
import { Model } from 'mongoose';
import { I18n, I18nService } from 'nestjs-i18n';
import { Public } from '../../helpers/decorators/Public';
import { Models } from '../../helpers/Models';
import { LoginRequest } from './interfaces/LoginRequest';
import { RegisterRequest } from './interfaces/RegisterRequest';
import { User } from './interfaces/Schemas.interface';
import { UtilService } from '../../helpers/util.service';


@ApiUseTags('Authentication')
@Controller('/auth')
export class AuthController {

    constructor(
        @InjectModel(Models.User) private readonly UserModel: Model<User>,
        private readonly jwtService: JwtService,
        private utils: UtilService,
    ) { }

    @Public()
    @Post('/register')
    async register(@Body() data: RegisterRequest, @I18n() i18n: I18nService) {
        const identifier = data.emailOrPhone;

        // identifying if it's an email or a phone
        let validator = new Validator();
        let isPhone = validator.isNumberString(identifier);
        let isEmail = validator.isEmail(identifier);

        if (!isPhone && !isEmail) {
            throw new BadRequestException('Must enter a valid phone or email');
        }

        delete data.emailOrPhone;

        if (isPhone) {
            await this.utils.isUnique(this.UserModel, 'phone', identifier);
            data['phone'] = identifier;
        }

        if (isEmail) {
            await this.utils.isUnique(this.UserModel, 'email', identifier);
            data['email'] = identifier;
        }

        let user = await this.UserModel.create(data);

        return {
            message: i18n.translate('messages.success.register'),
            token: await this.jwtService.signAsync(user.toJSON()),
            user: {
                email: user.email,
                phone: user.phone,
                name: user.name
            }
        };
    }

    @Public()
    @Post('/login')
    @ApiOkResponse({ description: 'Successful login' })
    async login(@Body() { identifier, password }: LoginRequest, @I18n() i18n: I18nService): Promise<any> {
        let searchFor = { password };

        let validator = new Validator();
        let isPhone = validator.isNumberString(identifier);
        let isEmail = validator.isEmail(identifier);

        if (!isPhone && !isEmail) {
            throw new BadRequestException('Must enter a valid phone or email');
        }

        if (isPhone)
            searchFor['phone'] = identifier;

        if (isEmail)
            searchFor['email'] = identifier;

        let user = await this.UserModel.findOne(searchFor);

        if (!user)
            throw new UnauthorizedException(i18n.translate('messages.wrong_creds'));

        return {
            message: i18n.translate('messages.success.login'),
            token: await this.jwtService.signAsync(user.toJSON()),
            user: {
                email: user.email,
                phone: user.phone,
                name: user.name
            }
        };
    }
}
