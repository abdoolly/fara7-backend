import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { Account } from './interfaces/Account';
import { User } from '../users/interfaces/Schemas.interface';

@Injectable()
export class AccountsService {

    constructor(
        @InjectModel('Account') public readonly accountModel: Model<Account>,
        @InjectModel('User') public readonly userModel: Model<User>,
    ) { }

    /**
     * @description initiate the main account data
     * @param userId 
     */
    async initiateAccount(userId: ObjectId): Promise<Account> {
        return (await this.accountModel.create({
            owner: userId,
            collaborators: [],
            marriage_reqs: []
        })).toJSON();
    }

    /**
     * @description add a collborator to the account by the owner id
     * @param loggedUserId 
     * @param username 
     */
    async addCollaboratorToAccount(loggedUserId: string, username: string) {
        let collaborator = await this.userModel.findOne({ username });

        // TODO: localization
        if (!collaborator)
            throw new NotFoundException(`User with that username is not found`);

        await this.accountModel.findOneAndUpdate({
            owner: loggedUserId
        }, {
            $push: { collaborators: new ObjectId(collaborator._id) }
        });
    }
}
