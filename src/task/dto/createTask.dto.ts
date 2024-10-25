import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTaskDto {

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
        description: "The ID of the user to whom the task is assigned.",
        example: 42
    })
    @IsNotEmpty()
    assignedUserId: number;
}
