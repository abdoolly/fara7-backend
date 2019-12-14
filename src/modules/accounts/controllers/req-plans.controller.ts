import { Body, Controller, Get, Param, Post, Put, Delete } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Models } from '../../../helpers/Models';
import { UtilService } from '../../../helpers/util.service';
import { ReqPlan } from '../interfaces/ReqPlan';
import { ReqPlansService } from '../services/req-plans.service';
import { AddPlanTodo } from '../validationDTO/AddPlanTodoReq';
import { CreateReqPlan, PlanTodo } from '../validationDTO/CreateReqPlan';
import { UpdateReqPlan } from '../validationDTO/UpdateReqPlan';
import { UpdatePlanTodoParams } from '../validationDTO/UpdatePlanTodoReq';
import { PlanTodoService } from '../services/plan-todo.service';
import { ApiUseTags } from '@nestjs/swagger';

@Controller('req-plans')
@ApiUseTags('Requirement Plans / Plan Todos')
export class ReqPlansController {

    constructor(
        @InjectModel(Models.req_plan) public readonly reqPlanModel: Model<ReqPlan>,
        public reqPlanService: ReqPlansService,
        public planTodoService: PlanTodoService,
        public utilService: UtilService
    ) { }

    @Get('/:marriageReqId')
    async list(@Param('marriageReqId') marriageReqId: string) {
        this.utilService.isValidMongoId(marriageReqId, 'marriageReqId');
        return await this.reqPlanService.listReqPlans(marriageReqId);
    }

    @Post('/:marriageReqId')
    async create(@Body() { planName, planTodos }: CreateReqPlan, @Param('marriageReqId') marriageReqId: string) {
        this.utilService.isValidMongoId(marriageReqId, 'marriageReqId');
        return await this.reqPlanService.createReqPlan(planName, planTodos, marriageReqId);
    }

    @Put('/:reqPlanId')
    async updateReqPlan(@Body() { planName }: UpdateReqPlan, @Param('reqPlanId') reqPlanId: string) {
        this.utilService.isValidMongoId(reqPlanId, 'reqPlanId');
        return await this.reqPlanService.updateReqPlan(reqPlanId, planName);
    }

    @Delete('/:reqPlanId')
    async deleteReqPlan(@Param('reqPlanId') reqPlanId: string) {
        this.utilService.isValidMongoId(reqPlanId, 'reqPlanId');
        return await this.reqPlanService.deleteReqPlan(reqPlanId);
    }

    @Get('/:reqPlanId/plan-todo')
    async listPlanTodos(@Param('reqPlanId') reqPlanId: string) {
        this.utilService.isValidMongoId(reqPlanId, 'reqPlanId');
        return await this.planTodoService.listPlanTodos(reqPlanId);
    }

    @Post('/:reqPlanId/plan-todo')
    async addPlanTodos(@Param('reqPlanId') reqPlanId: string, @Body() { planTodos }: AddPlanTodo) {
        this.utilService.isValidMongoId(reqPlanId, 'reqPlanId');
        return await this.planTodoService.addPlanTodos(reqPlanId, planTodos);
    }

    @Put('/:reqPlanId/plan-todo/:planTodoId')
    async updatePlanTodo(@Param() { reqPlanId, planTodoId }: UpdatePlanTodoParams, @Body() planTodo: PlanTodo) {
        this.utilService.isValidMongoId(reqPlanId, 'reqPlanId');
        this.utilService.isValidMongoId(planTodoId, 'planTodoId');
        return await this.planTodoService.updatePlanTodo(reqPlanId, planTodoId, planTodo);
    }

    @Delete('/:reqPlanId/plan-todo/:planTodoId')
    async deletePlanTodo(@Param() { reqPlanId, planTodoId }: UpdatePlanTodoParams) {
        return await this.planTodoService.deletePlanTodo(reqPlanId, planTodoId);
    }
}
