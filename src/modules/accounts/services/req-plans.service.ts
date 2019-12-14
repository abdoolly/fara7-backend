import { Get, Injectable, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { Models } from '../../../helpers/Models';
import { ReqPlan } from '../interfaces/ReqPlan';

@Injectable()
export class ReqPlansService {
    constructor(
        @InjectModel(Models.req_plan) public readonly reqPlanModel: Model<ReqPlan>,
        private trns: I18nRequestScopeService
    ) { }

    async listReqPlans(marriageReqId: string) {
        return await this.reqPlanModel.find({
            marriage_req_id: marriageReqId
        });
    }

    async createReqPlan(text: string, marriageReqId: string) {

    }
}
