import { IsNotEmpty } from "class-validator";
import { IsUserAlreadyExist } from "../../helpers/validators/Unique";
import { IsPasswordConfirmed } from "../../helpers/validators/ConfirmPassword";
import { ApiModelProperty } from "@nestjs/swagger";

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
    password: string;

    @ApiModelProperty()
    @IsNotEmpty()
    @IsPasswordConfirmed()
    confirm_password: string;
}