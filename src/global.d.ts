declare namespace Express {
    export interface User {
        _id: string;
        phone?: string;
        email?: string;
        name?: string;
        password?: string;
    }
}