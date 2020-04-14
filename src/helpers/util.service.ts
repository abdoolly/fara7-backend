import { Injectable, BadRequestException } from "@nestjs/common";
import { Types } from 'mongoose';

@Injectable()
export class UtilService {
    isValidMongoId(mongoId: string, itemName?: string) {
        if (!Types.ObjectId.isValid(mongoId)) {
            let message = itemName ? `${itemName} is not a valid mongoId` : `invalid mongoId`;
            throw new BadRequestException(message);
        }

        return true;
    }

    /**
     * @description check if a certain field has a unique value 
     * @param model 
     * @param fieldName 
     * @param value 
     */
    async isUnique(model: any, fieldName: string, value: any) {
        const user = await model.findOne({ [fieldName]: value });
        if (user)
            throw new BadRequestException(`${fieldName} is already exists`);

        return true;
    }
}