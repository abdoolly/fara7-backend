import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './interfaces/Schemas.interface';
import { ApiBearerAuth } from '@nestjs/swagger';
@ApiBearerAuth()
@Controller('/')
export class UsersController {

    constructor(@InjectModel('User') private readonly UserModel: Model<User>) { }

    @Get('/list/users')
    async listUsers() {
        let allUsers = await this.UserModel.find({});
        return allUsers;
    }
}
