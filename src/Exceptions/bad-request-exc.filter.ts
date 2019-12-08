import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';
import { I18nService } from 'nestjs-i18n';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {

    constructor(
        private readonly i18n: I18nService
    ) { }

    catch(exception: BadRequestException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        // getting the exception response to translate it 
        let exceptionResponse = exception.getResponse() as ValidationExceptionResponse;

        // getting the current language from the request context
        let i18nLang = host.switchToHttp().getRequest().i18nLang;

        // making the translation function the translation service 
        let translate = (key: string) => this.i18n['translations'][i18nLang][key];

        // handling case the messages was an array this means this is an actual validation message
        // from the class validator package
        if (Array.isArray(exceptionResponse.message))
            this.handleArrayMsg(exceptionResponse.message, translate)


        // handling case this is a manual threw exception and we are giving a string
        if (typeof exceptionResponse.message === 'string')
            exceptionResponse.message = translate(exceptionResponse.message);

        return response
            .status(status)
            .send(exception.getResponse());
    }

    handleArrayMsg(messages: ValidationMsg[], translate: (key) => string) {
        for (let msg of messages) {
            if (msg.constraints && Object.keys(msg.constraints)) {
                for (let [constraintName, message] of Object.entries(msg.constraints)) {
                    msg.constraints[constraintName] = translate(message);
                }
            }
        }

        return messages;
    }
}

interface ValidationExceptionResponse {
    statusCode: 400,
    error: "Bad Request",
    message: ValidationMsg[]
}

interface ValidationMsg {
    value: string;
    property: string;
    children: any[],
    constraints: {
        [key: string]: string;
    }
}