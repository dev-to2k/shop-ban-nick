import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, HttpException } from '@nestjs/common';
import { Response } from 'express';

export type FieldError = { field: string; message: string };

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const body = exception instanceof HttpException ? exception.getResponse() : { message: 'Internal server error' };
    const payload = typeof body === 'object' && body !== null ? (body as Record<string, unknown>) : { message: String(body) };

    let errors: FieldError[] = [];
    if (Array.isArray(payload.errors)) {
      const issues = payload.errors as Array<{ path?: (string | number)[]; message?: string }>;
      const isZodIssue = issues.length && issues.some((i) => Array.isArray(i.path));
      errors = isZodIssue
        ? issues.map((i) => ({ field: Array.isArray(i.path) ? String(i.path[0] ?? '') : '', message: i.message ?? 'Validation failed' }))
        : (payload.errors as FieldError[]);
    } else if (typeof payload.field === 'string' && typeof payload.message === 'string') {
      errors = [{ field: payload.field, message: payload.message }];
    } else {
      errors = [{ field: '_', message: (payload.message as string) || 'Error' }];
    }

    res.status(status).json({ statusCode: status, errors });
  }
}
