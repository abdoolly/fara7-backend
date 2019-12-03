import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { Model } from "mongoose";
import { User } from "../../modules/users/interfaces/Schemas.interface";

@ValidatorConstraint({ async: false })
@Injectable()
export class ConfirmPassword implements ValidatorConstraintInterface {

    constructor(@InjectModel('User') public userModel: Model<User>) { }

    validate(value: any, args: ValidationArguments) {
        let { password, confirm_password }: any = args.object;

        if (password === confirm_password)
            return true;

        return false;
    }

    defaultMessage?(validationArguments?: ValidationArguments) {
        // TODO: localize
        return `Password and confirm password should match`;
    }

}

export function IsPasswordConfirmed(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: ConfirmPassword
        });
    };
}