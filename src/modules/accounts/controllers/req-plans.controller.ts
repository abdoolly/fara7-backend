import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Models } from '../../../helpers/Models';
import { UtilService } from '../../../helpers/util.service';
import { ReqPlan } from '../interfaces/ReqPlan';
import { ReqPlansService } from '../services/req-plans.service';
import { CreateReqPlan, PlanTodo } from '../validationDTO/CreateReqPlan';
import { UpdateReqPlan } from '../validationDTO/UpdateReqPlan';

@Controller('req-plans')
export class ReqPlansController {

    constructor(
        @InjectModel(Models.req_plan) public readonly reqPlanModel: Model<ReqPlan>,
        public reqPlanService: ReqPlansService,
        public utilService: UtilService
    ) { }

    @Get('/:marriageReqId')
    async list(@Param('marriageReqId') marriageReqId: string) {
        this.utilService.isValidMongoId(marriageReqId, 'marriageReqId');
        return await this.reqPlanService.listReqPlans(marriageReqId);
    }

    @Post('/:marriageReqId')
    async create(@Body() body: CreateReqPlan, @Param('marriageReqId') marriageReqId: string) {
        this.utilService.isValidMongoId(marriageReqId, 'marriageReqId');
        // return await this.reqPlanService.createReqPlan(text, marriageReqId);
    }

    @Post('/:reqPlanId/plan-todo')
    async addPlanTodo(@Param('reqPlanId') reqPlanId: string, @Body() body: PlanTodo) {
        this.utilService.isValidMongoId(reqPlanId, 'reqPlanId');
    }

    @Put('/:reqPlanId')
    async update(@Body() { planName }: UpdateReqPlan, @Param('reqPlanId') reqPlanId: string) {
        this.utilService.isValidMongoId(reqPlanId, 'reqPlanId');
        return 1;
    }
}
