import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { UtilService } from '../../../helpers/util.service';
import { PlanTodoService } from '../services/plan-todo.service';
import { ReqPlansService } from '../services/req-plans.service';
import { CreateReqPlan } from '../validationDTO/CreateReqPlan';
import { UpdateReqPlan } from '../validationDTO/UpdateReqPlan';

@Controller('req-plans')
@ApiUseTags('Requirement Plans / Plan Todos')
export class ReqPlansController {

    constructor(
        public reqPlanService: ReqPlansService,
        public planTodoService: PlanTodoService,
        public utilService: UtilService
    ) { }

    @Get('/:marriageReqId')
    async list(@Param('marriageReqId') marriageReqId: string, @Req() { user }) {
        this.utilService.isValidMongoId(marriageReqId, 'marriageReqId');
        return await this.reqPlanService.listReqPlans(user._id, marriageReqId);
    }

    @Post('/:marriageReqId')
    async create(@Body() reqPlanData: CreateReqPlan, @Param('marriageReqId') marriageReqId: string) {
        this.utilService.isValidMongoId(marriageReqId, 'marriageReqId');
        return await this.reqPlanService.createReqPlan(reqPlanData, marriageReqId);
    }

    @Put('/:reqPlanId')
    async updateReqPlan(@Body() reqPlanData: UpdateReqPlan, @Param('reqPlanId') reqPlanId: string) {
        this.utilService.isValidMongoId(reqPlanId, 'reqPlanId');
        return await this.reqPlanService.updateReqPlan(reqPlanId, reqPlanData);
    }

    @Delete('/:reqPlanId')
    async deleteReqPlan(@Param('reqPlanId') reqPlanId: string) {
        this.utilService.isValidMongoId(reqPlanId, 'reqPlanId');
        return await this.reqPlanService.deleteReqPlan(reqPlanId);
    }

    @Get('single/:reqPlanId')
    async getSingleReqPlan(@Param('reqPlanId') reqPlanId: string) {
        this.utilService.isValidMongoId(reqPlanId, 'reqPlanId');
        return await this.reqPlanService.getSingleReqPlan(reqPlanId);
    }

    // @Get('/:reqPlanId/plan-todo')
    // async listPlanTodos(@Param('reqPlanId') reqPlanId: string) {
    //     this.utilService.isValidMongoId(reqPlanId, 'reqPlanId');
    //     return await this.planTodoService.listPlanTodos(reqPlanId);
    // }

    // @Post('/:reqPlanId/plan-todo')
    // async addPlanTodos(@Param('reqPlanId') reqPlanId: string, @Body() { planTodos }: AddPlanTodo) {
    //     this.utilService.isValidMongoId(reqPlanId, 'reqPlanId');
    //     return await this.planTodoService.addPlanTodos(reqPlanId, planTodos);
    // }

    // @Put('/:reqPlanId/plan-todo/:planTodoId')
    // async updatePlanTodo(@Param() { reqPlanId, planTodoId }: UpdatePlanTodoParams, @Body() planTodo: PlanTodo) {
    //     this.utilService.isValidMongoId(reqPlanId, 'reqPlanId');
    //     this.utilService.isValidMongoId(planTodoId, 'planTodoId');
    //     return await this.planTodoService.updatePlanTodo(reqPlanId, planTodoId, planTodo);
    // }

    // @Delete('/:reqPlanId/plan-todo/:planTodoId')
    // async deletePlanTodo(@Param() { reqPlanId, planTodoId }: UpdatePlanTodoParams) {
    //     return await this.planTodoService.deletePlanTodo(reqPlanId, planTodoId);
    // }
}
