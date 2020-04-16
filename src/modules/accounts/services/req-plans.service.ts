import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { Models } from '../../../helpers/Models';
import { ReqPlan, ReqPlanDoc } from '../interfaces/ReqPlan';

@Injectable()
export class ReqPlansService {
    constructor(
        @InjectModel(Models.req_plan) public readonly reqPlanModel: Model<ReqPlanDoc>,
        public i18n: I18nRequestScopeService
    ) { }

    async listReqPlans(userId: string, marriageReqId: string) {
        // validate that this marriageReqId belong to the logged in user

        return await this.reqPlanModel.find({
            marriage_req_id: marriageReqId
        });
    }

    async createReqPlan({ planName, dueDate, ...restOfPlanData }: ReqPlan, marriageReqId: string) {
        // validate that this marriageReqId belong to the logged in user

        let { lastErrorObject, value: reqPlan } = await this.reqPlanModel.findOneAndUpdate({
            marriage_req_id: marriageReqId,
            planName
        }, {
            planName,
            marriage_req_id: marriageReqId,
            dueDate: new Date(dueDate),
            ...restOfPlanData,
        }, { upsert: true, new: true, rawResult: true });

        if (lastErrorObject.updatedExisting)
            throw new BadRequestException('messages.planAlreadyExist');

        console.log('reqPlan.dueDate', reqPlan.dueDate.getDate());

        return reqPlan;
    }

    async updateReqPlan(reqPlanId: string, reqPlanData: ReqPlan) {
        let { lastErrorObject, value: reqPlan } = await this.reqPlanModel.findOneAndUpdate({
            _id: reqPlanId
        }, {
            ...reqPlanData,
        }, { rawResult: true, new: true });

        // if the update Existing is false means the update failed 
        if (!lastErrorObject.updatedExisting)
            throw new BadRequestException(`no reqPlan with this ReqPlanId ${reqPlanId}`);

        return reqPlan;
    }

    async deleteReqPlan(reqPlanId: string) {
        let { deletedCount } = await this.reqPlanModel.deleteOne({ _id: reqPlanId });
        if (deletedCount === 0)
            throw new BadRequestException('reqPlanId does not exist');

        return this.i18n.translate('messages.success.deleted');
    }

    async getSingleReqPlan(reqPlanId: string) {
        const reqPlan = await this.reqPlanModel.findById(reqPlanId);
        if (!reqPlan) {
            throw new BadRequestException(`Requirement plan id ${reqPlanId} does not exist`);
        }

        return reqPlan;
    }
}
