import { IsNotEmpty } from "class-validator";
import { IsUserAlreadyExist } from "../../helpers/validators/Unique";
import { IsPasswordConfirmed } from "../../helpers/validators/ConfirmPassword";

export class RegisterRequest {
    @IsNotEmpty()
    @IsUserAlreadyExist()
    username: string;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    @IsPasswordConfirmed()
    confirm_password: string;
}