import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {

    /**
     * @description this is a middleware to apply authentication
     * @param req 
     * @param res 
     * @param next 
     */
    use(req: Request, res: Response, next: Function) {
        console.log('Request...', req.body);
        next();
    }
}
