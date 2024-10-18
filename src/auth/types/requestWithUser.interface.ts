import { Request } from "express";

export interface RequestWithUser extends Request {
    user: {
        id: number;
        email: string;
        username: string;
        isAdmin: boolean;
    }
}