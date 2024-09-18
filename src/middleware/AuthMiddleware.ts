import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { responseError } from "../utils/ApiResponse";
import { CustomError } from "../utils/ErrorHandling";
import { SessionData } from "../model/AuthModel";

function authMiddleware(allowedRoles: string[]){
  return function (req: Request & { session: SessionData }, res: Response, next: NextFunction) {
    const userRole = req.session.role;
    // console.log(allowedRoles, userRole)

    if (allowedRoles.includes(userRole)) {
      return next();
    }
    const error = new CustomError(
      StatusCodes.UNAUTHORIZED,
      "Session Unaouthorized"
    );
    responseError(res, false, error);
  }
}

export default authMiddleware;
