import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {

    @ApiProperty({
        description: 'The username of the user. It must be a non-empty string and will be used for user identification within the application.',
        example: 'tmk2109',
    })
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        description: 'The email address of the user. This must be a valid email format and will be used for communication and account verification.',
        example: 'tmk2109@gmail.com'
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'The password for the user’s account. It must be at least 6 characters long and cannot be empty.',
        example: '123456'
    })
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiProperty({
        description: 'Indicates whether the user has administrative privileges. This field is optional; if not provided, the user will be assigned the default role (non-admin).',
        example: 'false'
    })
    @IsOptional()
    @IsBoolean()
    isAdmin: boolean;
}