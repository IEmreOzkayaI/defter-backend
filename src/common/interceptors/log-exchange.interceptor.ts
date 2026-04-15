import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LogExchangeInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LogExchangeInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const type = context.getType<'http' | 'rpc'>();

    if (type === 'http') {
      return this.handleHttp(context, next);
    }

    if (type === 'rpc') {
      return this.handleGrpc(context, next);
    }

    return next.handle();
  }

  private handleHttp(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const req = http.getRequest();
    const res = http.getResponse();

    const hasBody = req.body !== undefined;

    if (hasBody) {
      this.logger.debug(`HTTP_REQUEST body: ${JSON.stringify(req.body)}`);
    }

    const originalJson = res.json.bind(res);
    res.json = (body: unknown) => {
      this.logger.debug(`HTTP_RESPONSE body: ${JSON.stringify(body)}`);
      return originalJson(body);
    };

    return next.handle();
  }

  private handleGrpc(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const rpc = context.switchToRpc();
    const data = rpc.getData();

    if (data !== undefined) {
      this.logger.debug(`GRPC_REQUEST body: ${JSON.stringify(data)}`);
    }

    return next.handle().pipe(
      tap((response) => {
        this.logger.debug(`GRPC_RESPONSE body: ${JSON.stringify(response)}`);
      }),
    );
  }
}
