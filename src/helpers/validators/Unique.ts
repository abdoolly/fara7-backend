import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, validate } from "class-validator";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "../../users/interfaces/Schemas.interface";

async function unique(model: Model<any>, property: string, value: any) {
    if (await model.findOne({ [property]: value }))
        return false;

    return true;
}

@ValidatorConstraint({ async: true })
@Injectable()
export class UserAlreadyExists implements ValidatorConstraintInterface {

    constructor(@InjectModel('User') public userModel: Model<User>) { }

    async validate(value: any, args: ValidationArguments) {
        return await unique(this.userModel, 'username', value);
    }

    defaultMessage?(validationArguments?: ValidationArguments) {
        // TODO: localize
        return `username already exists`;
    }

}

export function IsUserAlreadyExist(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: UserAlreadyExists
        });
    };
}