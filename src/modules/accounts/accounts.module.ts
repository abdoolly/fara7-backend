import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountSchema } from './schemas/Account';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Account', schema: AccountSchema }
        ]),
    ],
    controllers: [AccountsController],
    providers: [AccountsService]
})
export class AccountsModule { }
