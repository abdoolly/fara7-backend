import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { I18n, I18nService } from 'nestjs-i18n';
import { Public } from '../../helpers/decorators/Public';
import { AccountsService } from './accounts.service';
import { MarriageReqService } from './marriage-req.service';
import { AddCollabratorReq } from './validationDTO/AddCollabratorReq';
import { CreateMarriageReq } from './validationDTO/CreateMarriageReq';

@Controller('accounts')
export class MarriageReqController {

    constructor(
        public accountService: AccountsService,
        public marriageReqService: MarriageReqService,
    ) { }

    // @Public()
    // @Get('/')
    // async initAccount() {
    //     // return await this.accountService.initiateAccount();
    // }

    @Post('/marriage/req')
    async createMarriageRequirement(@Req() { user }: Request, @Body() { name }: CreateMarriageReq, @I18n() i18n: I18nService) {
        return await this.marriageReqService.createMarriageRequirement(user['_id'], name);
    }

    @Post('/add/collaborator')
    async addMarriageReqCollborator(@Req() { user }: Request, @Body() { username, marriageReqId }: AddCollabratorReq) {
        return await this.marriageReqService.addCollborator(user['_id'], marriageReqId, username);
    }

    @Get('/')
    async getMarriageReqs(@Req() { user }: Request) {
        return await this.marriageReqService.getMarriageReqs(user['_id']);
    }
}
