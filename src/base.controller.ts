enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export interface BaseResponseParams<T> {
  data: T;
  status: HttpStatus;
}
export interface BaseResponse<T> {
  data: T;
  message: string;
  status: HttpStatus;
}
export class BaseController {
  baseResponse<T>(params: BaseResponseParams<T>): BaseResponse<T> {
    const { data, status } = params;
    let message = null;
    if (!message) {
      switch (status) {
        case HttpStatus.CREATED:
          message = 'Resource created successfully';
          break;
        case HttpStatus.NOT_FOUND:
          message = 'Resource not found';
          break;
        default:
          message = status < 400 ? 'Success' : 'Error';
      }
    }
    return { data, message, status };
  }
}
