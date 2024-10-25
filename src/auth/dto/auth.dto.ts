import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class AuthPayloadDto {

    @ApiProperty({
        description: "The registered email.",
        example: "admin@example.com"
    })
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: "The registered password.",
        example: "1"
    })
    @IsNotEmpty()
    password: string;
}