import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Model } from 'mongoose';
import { User } from './interfaces/Schemas.interface';
import { Models } from '../../helpers/Models';

@ApiBearerAuth()
@Controller('/')
export class UsersController {

    constructor(@InjectModel(Models.User) private readonly UserModel: Model<User>) { }

    @Get('/list/users')
    async listUsers() {
        let allUsers = await this.UserModel.find({});
        return allUsers;
    }
}
