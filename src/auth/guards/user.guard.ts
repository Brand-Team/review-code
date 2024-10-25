import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";

@Injectable()
export class UserGuard implements CanActivate {

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user || user.isAdmin) {
            throw new HttpException('You are not a normal user.', HttpStatus.FORBIDDEN);
        }
        return true;
    }
}