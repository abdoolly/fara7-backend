import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { I18n, I18nService } from 'nestjs-i18n';
import { MarriageReqService } from './marriage-req.service';
import { AddCollabratorReq } from './validationDTO/AddCollabratorReq';
import { CreateMarriageReq } from './validationDTO/CreateMarriageReq';

@Controller('accounts')
export class MarriageReqController {

    constructor(
        public marriageReqService: MarriageReqService,
    ) { }

    @Get('/')
    async getMarriageReqs(@Req() { user }: Request) {
        return await this.marriageReqService.getMarriageReqs(user['_id']);
    }

    @Post('/marriage/req')
    async createMarriageRequirement(@Req() { user }: Request, @Body() { name }: CreateMarriageReq, @I18n() i18n: I18nService) {
        return await this.marriageReqService.createMarriageRequirement(user['_id'], name);
    }

    @Post('/add/collaborator')
    async addMarriageReqCollborator(@Req() { user }: Request, @Body() { username, marriageReqId }: AddCollabratorReq) {
        return await this.marriageReqService.addCollborator(user['_id'], marriageReqId, username);
    }
}
