import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
  statusCode: number;
  message: String;
}

@Injectable()
export class ResponseWrapperInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {

    return next
        .handle()
        .pipe(
            map(
                (data) => {
                  return {
                    statusCode: context.switchToHttp().getResponse().statusCode,
                    message: data.message ?? 'Success',
                    data: data
                }},
            ),
        );
  }
}