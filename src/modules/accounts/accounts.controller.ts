import { Controller, Get } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { Public } from '../../helpers/decorators/Public';

@Controller('accounts')
export class AccountsController {

    constructor(public accountService: AccountsService) { }

    @Public()
    @Get('/')
    async initAccount() {
        // return await this.accountService.initiateAccount();
    }
}
