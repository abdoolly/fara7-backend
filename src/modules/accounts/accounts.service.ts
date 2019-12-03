import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Account } from './interfaces/Account';
import { Model, Schema } from 'mongoose';
import { ObjectID } from 'bson';

@Injectable()
export class AccountsService {

    constructor(@InjectModel('Account') public readonly accountModel: Model<Account>) { }

    async initiateAccount(userId: ObjectID) {
        let result = await this.accountModel.create({
            owner: userId,
            collaborators: [],
            marriage_reqs: []
        });
        console.log('result', result);
        return result.toJSON();
    }
}
