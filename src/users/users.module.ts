import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { UserSchema } from './schemas/User';
import { UsersController } from './users.controller';
import { UserAlreadyExists } from '../helpers/validators/Unique';

@Module({
    imports: [MongooseModule.forFeature(
        [
            { name: 'User', schema: UserSchema }
        ]),
    ],
    providers: [UserAlreadyExists],
    controllers: [UsersController, AuthController]
})
export class UsersModule { }
