import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional } from "class-validator";

export class UpdateTaskDto {

    @ApiProperty({
        description: "The title of the task that describes its purpose.",
        example: "Implement user authentication"
    })
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        description: "A detailed description of the task, outlining the requirements and goals.",
        example: "Create a secure authentication system using JWT tokens."
    })
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        description: "Indicates whether the task has been completed. Defaults to false if not provided.",
        example: false
    })
    @IsOptional()
    @IsBoolean()
    completed: boolean;
    
}