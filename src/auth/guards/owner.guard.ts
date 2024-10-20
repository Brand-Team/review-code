import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { TaskService } from "src/task/task.service";

@Injectable()
export class OwnerGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private readonly taskService: TaskService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const userId = request.user.id;

        const { taskId } = request.params;

        const task = await this.taskService.findOne(taskId);

        console.log(userId)

        if (!task || task.user.id !== userId) {
            throw new ForbiddenException('You do not own this task');
        }

        return true;
    }
}