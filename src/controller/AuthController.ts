import { Request, Response } from "express";
import { AuthService } from "../service/AuthService";
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  SessionData,
} from "../model/AuthModel";
import { getSessionUserId } from "../utils/GetUserSession";

import {
  responseError,
  responseSuccess,
  responseSuccessWithoutData,
} from "../utils/ApiResponse";
import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import { loginValidation, registerValidation } from "../utils/Validation";

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  async login(req: Request<any, any, LoginRequest>, res: Response) {
    const {
      error,
      value,
    }: { error: Joi.ValidationError; value: LoginRequest } =
      loginValidation.validate(req.body, { abortEarly: false });
    if (error) {
      responseError(res, false, error);
      return;
    }

    try {
      const result = await this.authService.login(value.email, value.password);

      if (result) {
        (req.session as SessionData).userId = result.userId.toString();
        responseSuccessWithoutData(
          res,
          StatusCodes.OK,
          true,
          "Successfully Login"
        );
      }
    } catch (error) {
      console.log(error.message);
      responseError(res, false, error);
    }
  }

  async logout(req: Request, res: Response) {
    try {
      await this.authService.logout(req);
      res.clearCookie("connect.sid");
      responseSuccessWithoutData(res, StatusCodes.OK, true, "Logout success");
    } catch (error) {
      responseError(res, false, error);
    }
  }

  async register(req: Request<any, any, RegisterRequest>, res: Response) {
    const {
      error,
      value,
    }: { error: Joi.ValidationError; value: RegisterRequest } =
      registerValidation.validate(req.body, { abortEarly: false });
    if (error) {
      responseError(res, false, error);
      return;
    }

    try {
      const result = await this.authService.register(
        value.name,
        value.email,
        value.password
      );
      responseSuccessWithoutData(
        res,
        StatusCodes.CREATED,
        true,
        "Successfully Register"
      );
    } catch (error) {
      console.log(error.message);
      responseError(res, false, error);
    }
  }

  async getMe(req: Request, res: Response) {
    try {
      const userId = getSessionUserId(req);
      const user = await this.authService.getUserById(Number(userId));
      const responseData: AuthResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
      };
      responseSuccess(
        res,
        StatusCodes.OK,
        true,
        "Successfully Get User Data",
        responseData
      );
    } catch (error) {
      responseError(res, false, error);
    }
  }
}
