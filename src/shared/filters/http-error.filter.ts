import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Logger,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';

import * as fse from 'fs-extra';

interface ErrorLogModel {
  message: any;
}

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  constructor() {}
  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = {
      code: status,
      timestamp: new Date(),
      path: request.url,
      method: request.method,
      message:
        status !== HttpStatus.INTERNAL_SERVER_ERROR
          ? exception.message.error || exception.message || null
          : 'Internal server error',
    };

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      Logger.error(
        `${request.method} ${request.url}`,
        exception.stack,
        'ExceptionFilter',
      );
    } else {
      Logger.error(
        `${request.method} ${request.url}`,
        JSON.stringify(errorResponse),
        'ExceptionFilter',
      );
    }

    const logFilePath = `./logs/error-logs.txt`;
    let content = '';
    let notExist: boolean;

    if (fse.pathExistsSync('./logs')) {
      content = await fse.readFile(logFilePath).toString();
      notExist = false;
    } else {
      notExist = true;
    }
    content +=
      '\n' + JSON.stringify({ status, ...errorResponse, time: new Date() });

    if (notExist) {
      await fse.mkdir(`./logs`);
      await fse.createFile(logFilePath);
    }
    await fse.writeFile(logFilePath, content);

    response.status(status).json(errorResponse);
  }
}
