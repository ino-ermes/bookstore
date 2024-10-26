import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { Request, Response } from 'express';

@Catch(mongoose.Error)
export class MongooseExceptionFilter implements ExceptionFilter {
  catch(exception: mongoose.Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: exception.message,
      error: 'Bad Request',
    });
  }
}
