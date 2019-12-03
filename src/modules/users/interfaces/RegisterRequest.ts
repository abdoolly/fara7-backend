import { ApiModelProperty } from "@nestjs/swagger";
import { IsNotEmpty, MinLength } from "class-validator";
import { IsPasswordConfirmed } from "../../../helpers/validators/ConfirmPassword";
import { IsUserAlreadyExist } from "../../../helpers/validators/Unique";

//TODO: localization

export class RegisterRequest {
    @ApiModelProperty()
    @IsNotEmpty()
    @IsUserAlreadyExist()
    username: string;

    @ApiModelProperty()
    @IsNotEmpty()
    name: string;

    @ApiModelProperty()
    @IsNotEmpty()
    @MinLength(3)
    password: string;

    @ApiModelProperty()
    @IsNotEmpty()
    @IsPasswordConfirmed()
    confirm_password: string;
}