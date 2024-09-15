import { Request } from "express";
import { SessionData } from "../model/AuthModel";

export function getSessionUserId(req: Request): string | undefined {
    return (req.session as SessionData).userId;
}