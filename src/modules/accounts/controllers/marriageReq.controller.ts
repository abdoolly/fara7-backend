import { Body, Controller, Get, Post, Put, Req } from '@nestjs/common';
import { Request } from 'express';
import { MarriageReqService } from '../services/marriage-req.service';
import { AddCollabratorReq } from '../validationDTO/AddCollabratorReq';
import { CreateMarriageReq } from '../validationDTO/CreateMarriageReq';
import { UpdateMarriageReq } from '../validationDTO/UpdateMarriageReq';

@Controller('marriage-req')
export class MarriageReqController {

    constructor(
        public marriageReqService: MarriageReqService,
    ) { }

    @Get('/')
    async getMarriageReqs(@Req() { user }: Request) {
        return await this.marriageReqService.getMarriageReqs(user._id);
    }

    @Post('/')
    async createMarriageRequirement(@Req() { user }: Request, @Body() { name }: CreateMarriageReq) {
        return await this.marriageReqService.createMarriageRequirement(user._id, name);
    }

    @Post('/add/collaborator')
    async addMarriageReqCollborator(@Req() { user }: Request, @Body() { username, marriageReqId }: AddCollabratorReq) {
        return await this.marriageReqService.addCollborator(user._id, marriageReqId, username);
    }

    @Put('/')
    async updateMarriageReq(@Req() { user }: Request, @Body() { marriageReqId, data }: UpdateMarriageReq) {
        return await this.marriageReqService.updateMarriageReq(user._id, marriageReqId, data);
    }
}
