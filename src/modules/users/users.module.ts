import { forwardRef, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfirmPassword } from '../../helpers/validators/ConfirmPassword';
import { UserAlreadyExists } from '../../helpers/validators/Unique';
import { AccountsModule } from '../accounts/accounts.module';
import { AuthController } from './auth.controller';
import { AuthGuard } from './guards/AuthGuard';
import { UserSchema } from './schemas/User';
import { UsersController } from './users.controller';

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET,
        }),
        MongooseModule.forFeature([
            { name: 'User', schema: UserSchema }
        ]),
        forwardRef(() => AccountsModule),
    ],
    providers: [
        UserAlreadyExists,
        ConfirmPassword,
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
