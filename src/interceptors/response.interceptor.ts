import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((data) => {
                const request = context.switchToHttp().getRequest();
                const statusCode = context.switchToHttp().getResponse().statusCode;

                const message = statusCode >= 200 && statusCode < 300 ? 'Success' : 'Fail';

                return {
                    data: data || [],
                    message: message,
                    meta: {
                        path: request.url,
                    }
                }
            })
        )
    }
}