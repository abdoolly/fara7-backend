import { Module, forwardRef } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UserAlreadyExists } from '../../helpers/validators/Unique';
import { AuthController } from './auth.controller';
import { AuthGuard } from './guards/AuthGuard';
import { UserSchema } from './schemas/User';
import { UsersController } from './users.controller';
import { AccountsModule } from '../accounts/accounts.module';

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET,
        }),
        MongooseModule.forFeature([
            { name: 'User', schema: UserSchema }
        ]),
        forwardRef(() => AccountsModule)
    ],
    providers: [
        UserAlreadyExists,
        { provide: APP_GUARD, useClass: AuthGuard },
    ],
    controllers: [UsersController, AuthController],
    exports: [
        MongooseModule.forFeature([
            { name: 'User', schema: UserSchema }
        ])
    ]
})
export class UsersModule { }
