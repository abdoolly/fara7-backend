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
}