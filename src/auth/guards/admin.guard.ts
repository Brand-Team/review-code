import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";

@Injectable()
export class AdminGuard implements CanActivate {

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user.isAdmin) {
            throw new HttpException('You are not an admin.', HttpStatus.FORBIDDEN);
        }
        return true;
    }
}