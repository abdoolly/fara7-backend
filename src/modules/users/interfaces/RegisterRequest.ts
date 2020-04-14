import { ApiModelProperty } from "@nestjs/swagger";
import { IsNotEmpty, MinLength } from "class-validator";
import { IsPasswordConfirmed } from "../../../helpers/validators/ConfirmPassword";
import { IsUserAlreadyExist } from "../../../helpers/validators/Unique";

//TODO: localization

export class RegisterRequest {
    @ApiModelProperty()
    @IsNotEmpty({ message: 'messages.no_username' })
    emailOrPhone: string;

    @ApiModelProperty()
    @IsNotEmpty({ message: 'messages.no_name' })
    name: string;

    @ApiModelProperty()
    @IsNotEmpty({ message: 'messages.no_password' })
    @MinLength(3, { message: 'messages.password_min' })
    password: string;

    @ApiModelProperty()
    @IsNotEmpty({ message: 'messages.confirm_password' })
    @IsPasswordConfirmed({ message: 'messages.not_confirmed' })
    confirm_password: string;
}