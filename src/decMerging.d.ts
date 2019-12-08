import { User as appUser } from './modules/users/interfaces/Schemas.interface';

declare namespace Express {
    export interface Request {
        koko: string;
    }

    export interface User {
        tenant?: string
    }
}