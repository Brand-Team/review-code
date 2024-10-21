import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, MinLength } from "class-validator";

export class CreateUserDto {

    @IsNotEmpty()
    username: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsOptional()
    @IsBoolean()
    isAdmin: boolean;
}