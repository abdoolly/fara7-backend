import { isNumberString, isEmail } from "class-validator";
import { UserInputError } from "apollo-server";

export const getIdentifierObject = (identifier: string) => {
    if (isNumberString(identifier))
        return { phone: identifier };

    if (isEmail(identifier))
        return { email: identifier };

    throw new UserInputError('Please enter a valid email or phone');
};