import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Models } from "../../../helpers/Models";
import { Model } from "mongoose";
import { ReqPlan } from "../interfaces/ReqPlan";
import { PlanTodo } from "../interfaces/PlanTodo";
import { I18nRequestScopeService } from "nestjs-i18n";

@Injectable()
export class PlanTodoService {

    constructor(
        @InjectModel(Models.req_plan) public readonly reqPlanModel: Model<ReqPlan>,
        public i18n: I18nRequestScopeService
    ) { }

    async addPlanTodos(reqPlanId: string, planTodos: PlanTodo[]) {
        // validate that this reqplan belong to the logged in user

        let { lastErrorObject, value: reqPlan } = await this.reqPlanModel.findOneAndUpdate({
            _id: reqPlanId
        }, {
            // pushing array of planTodos inside the planTodos element in the database
            $push: { planTodos: { $each: planTodos } }
        }, { rawResult: true, new: true });

        // if the update Existing is false means the update failed 
        if (!lastErrorObject.updatedExisting)
            throw new BadRequestException('no reqPlan with this ReqPlanId');

        return reqPlan;
    }

    async updatePlanTodo(reqPlanId: string, planTodoId: string, planTodo: PlanTodo) {
        // TODO: validate that this reqplan belong to the logged in user
        let { lastErrorObject, value: reqPlan } = await this.reqPlanModel.findOneAndUpdate({
            _id: reqPlanId,
            'planTodos._id': planTodoId
        }, {
            $set: {
                'planTodos.$.text': planTodo.text,
                'planTodos.$.dueDate': new Date(planTodo.dueDate),
            }
        }, {
            rawResult: true,
            new: true,

            // filtering the array to only get the first element if the array that match the planTodo id
            projection: {
                planTodos: {
                    $elemMatch: { _id: "5df452e7d19b28332ee8df1a" }
                }
            }
        });

        // checking if the update happened or not 
        if (!lastErrorObject.updatedExisting)
            throw new BadRequestException('ReqPlanId or planTodoId does not exist');

        // returning the first element since we know it will always be there 
        return reqPlan.planTodos[0];
    }

    async deletePlanTodo(reqPlanId: string, planTodoId: string) {
        let { lastErrorObject, value: reqPlan } = await this.reqPlanModel.findOneAndUpdate({
            _id: reqPlanId
        }, {
            $pull: { planTodos: { _id: planTodoId } }
        }, { rawResult: true, new: true });

        if (!lastErrorObject.updatedExisting)
            throw new BadRequestException('no reqPlan with this ReqPlanId');

        return this.i18n.translate('messages.success.deleted');
    }
}