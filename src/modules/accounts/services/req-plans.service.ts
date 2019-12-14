import { Get, Injectable, Post, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { Models } from '../../../helpers/Models';
import { ReqPlan } from '../interfaces/ReqPlan';
import { PlanTodo } from '../interfaces/PlanTodo';

@Injectable()
export class ReqPlansService {
    constructor(
        @InjectModel(Models.req_plan) public readonly reqPlanModel: Model<ReqPlan>,
        public i18n: I18nRequestScopeService
    ) { }

    async listReqPlans(marriageReqId: string) {
        // validate that this marriageReqId belong to the logged in user

        return await this.reqPlanModel.find({
            marriage_req_id: marriageReqId
        });
    }

    async createReqPlan(planName: string, planTodos: PlanTodo[] = [], marriageReqId: string) {
        // validate that this marriageReqId belong to the logged in user

        let { lastErrorObject, value: reqPlan } = await this.reqPlanModel.findOneAndUpdate({
            marriage_req_id: marriageReqId,
            planName
        }, {
            planName,
            marriage_req_id: marriageReqId,
            planTodos // just putting it with default value of an empty array 
        }, { upsert: true, new: true, rawResult: true });

        if (lastErrorObject.updatedExisting)
            throw new BadRequestException('messages.planAlreadyExist');

        return reqPlan;
    }

    async updateReqPlan(reqPlanId: string, planName: string) {
        let { lastErrorObject, value: reqPlan } = await this.reqPlanModel.findOneAndUpdate({
            _id: reqPlanId
        }, {
            planName
        }, { rawResult: true, new: true });

        // if the update Existing is false means the update failed 
        if (!lastErrorObject.updatedExisting)
            throw new BadRequestException('no reqPlan with this ReqPlanId');

        return reqPlan;
    }

    async deleteReqPlan(reqPlanId: string) {
        let { deletedCount } = await this.reqPlanModel.deleteOne({ _id: reqPlanId });
        if (deletedCount === 0)
            throw new BadRequestException('reqPlanId does not exist');

        return this.i18n.translate('messages.success.deleted');
    }
}
