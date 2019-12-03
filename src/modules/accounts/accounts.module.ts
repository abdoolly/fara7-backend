import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountSchema } from './schemas/Account';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Account', schema: AccountSchema }
        ]),
        forwardRef(() => UsersModule)
    ],
    controllers: [AccountsController],
    providers: [AccountsService],
    exports: [AccountsService]
})
export class AccountsModule { }
