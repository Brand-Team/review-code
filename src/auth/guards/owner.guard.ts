import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { TaskService } from "src/task/task.service";

@Injectable()
export class OwnerGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private readonly taskService: TaskService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const taskId = request.Param.id;

        const task = await this.taskService.findOne(taskId);

        if (!task || task.user.id !== user.id) {
            throw new ForbiddenException('You do not own this task');
        }

        return true;
    }
}