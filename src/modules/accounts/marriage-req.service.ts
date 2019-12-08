import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { Models } from '../../helpers/Models';
import { MarriageReq } from './interfaces/MarriageReq';
import { User } from '../users/interfaces/Schemas.interface';
import { ObjectId } from 'mongodb';

@Injectable()
export class MarriageReqService {

    constructor(
        @InjectModel(Models.marriage_req) public readonly marriageReqModel: Model<MarriageReq>,
        @InjectModel(Models.User) public readonly userModel: Model<User>,
        public trns: I18nRequestScopeService
    ) { }

    async createMarriageRequirement(ownerId: string, name: string) {
        let { lastErrorObject, value: marriageReq } = await this.marriageReqModel.findOneAndUpdate({
            owner_id: ownerId,
            name
        }, {
            owner_id: ownerId,
            name,
            collaborators: [],
            en_name: null,
            ar_name: null,
        }, { upsert: true, new: true, rawResult: true });

        if (lastErrorObject.updatedExisting)
            throw new BadRequestException('messages.categoryAlreadyExist');

        return marriageReq;
    }

    async getMarriageReqs(owner_id: string) {
        let marriageReqs = await this.marriageReqModel.find({
            owner_id
        }, { _id: 1, name: 1, ar_name: 1, en_name: 1 });

        return marriageReqs;
    }

    async addCollborator(ownerId: string, marriageReqId: string, collaboratorUsername: string) {
        // get the collborator by id 
        let toCollaborate = await this.userModel.findOne({
            username: collaboratorUsername
        });

        if (!toCollaborate)
            throw new BadRequestException('messages.user_not_found');

        if (toCollaborate._id === ownerId)
            throw new BadRequestException('messages.no_self_collboration');

        let result = await this.marriageReqModel.findOneAndUpdate({
            owner_id: ownerId,
            _id: marriageReqId
        }, {
            $addToSet: { collaborators: new ObjectId(toCollaborate._id) }
        }, { new: true });

        // case the owner id or the marriage requirement id is wrong
        if (!result)
            throw new NotFoundException('owner_id or marriageReqId is wrong');

        return this.trns.translate('messages.success.coll_added');
    }
}
