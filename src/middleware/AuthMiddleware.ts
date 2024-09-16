import { StatusCodes } from "http-status-codes";
import { responseError } from "../utils/ApiResponse";
import { CustomError } from "../utils/ErrorHandling";

function authMiddleware(req, res, next) {
  if (req.session.userId) {
    return next();
  }
  const error = new CustomError(
    StatusCodes.UNAUTHORIZED,
    "Session Unaouthorized"
  );
  responseError(res, false, error);
}

export default authMiddleware;
