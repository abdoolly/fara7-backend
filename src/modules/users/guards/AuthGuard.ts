import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate {
    public constructor(
        private readonly reflector: Reflector,
        private readonly jwtService: JwtService
    ) { }

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.get<boolean>("isPublic", context.getHandler());

        if (isPublic)
            return true;

        try {
            let req: Request = context.switchToHttp().getRequest();
            let token = this.getJwtToken(req);
            let isValid = await this.jwtService.verifyAsync(token, { ignoreExpiration: false });
            if (!isValid)
                this.throwException();

            let user = this.jwtService.decode(token);

            // adding request.user to the request object 
            req.user = user;

            return true;
        } catch (err) {
            console.log('err', err);
            this.throwException();
        }
    }

    getJwtToken(req: Request) {
        let token = req.header('authorization');
        if (!token)
            this.throwException();

        let [bearer, hash] = token.split(' ');
        if (bearer !== 'Bearer' || !hash)
            this.throwException();

        return hash;
    }

    throwException() {
        throw new UnauthorizedException();
    }
}