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
        const userId = request.user.id;                                           // request.user is the returned payload of the request from JWT strategy, and the payload includes property 'id'

        const { id: taskId } = request.params;

        const task = await this.taskService.findOne(Number(taskId));

        console.log(task)

        if (task && (task.user.id === userId || task.owner.id === userId)) {     // task.user.id is the userId column of the Task entity, task.owner.id is the ownerId of the Task entity 
            return true;
        }

        throw new ForbiddenException('You do not have access to this task');
    }
}