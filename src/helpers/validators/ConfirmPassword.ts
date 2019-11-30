import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({ async: false })
export class ConfirmPassword implements ValidatorConstraintInterface {

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