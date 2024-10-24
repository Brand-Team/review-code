import { IsBoolean, IsNotEmpty, IsOptional } from "class-validator";

export class UpdateTaskDto {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    description: string;

    @IsOptional()
    @IsBoolean()
    completed: boolean;
}