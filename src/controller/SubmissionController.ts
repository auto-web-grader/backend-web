import { Request, Response } from "express";
import { SubmissionService } from "../service/SubmissionService";
import { FileRequest, UserSubmissionResponse } from "../model/SubmissionModel";
import { getSessionUserId } from "../utils/GetUserSession";
import {
  responseError,
  responseSuccess,
  responseSuccessWithoutData,
} from "../utils/ApiResponse";
import { StatusCodes } from "http-status-codes";
import { AuthResponse } from "../model/AuthModel";
import { CustomError } from "../utils/ErrorHandling";

export class SubmissionController {
  private submissionService: SubmissionService;

  constructor(submissionService: SubmissionService) {
    this.submissionService = submissionService;
  }
  async uploadSubmission(req: Request<any, any, FileRequest>, res: Response) {
    try {
      const file = req.file;
      const { type } = req.body;
      console.log(file);
      if (!file) {
        throw new CustomError(StatusCodes.BAD_REQUEST, "No file uploaded!");
      }
      const result = this.submissionService.uploadSubmission(
        file.path,
        type,
        Number(getSessionUserId(req))
      );
      responseSuccessWithoutData(
        res,
        StatusCodes.ACCEPTED,
        true,
        "File uploaded successfully"
      );
    } catch (error) {
      responseError(res, false, error);
    }
  }

  async getUserSubmission(req: Request, res: Response) {
    try {
      const userId = await getSessionUserId(req);
      const data = await this.submissionService.getUserSubmission(
        Number(userId)
      );
      const responseData: UserSubmissionResponse[] = [];
      data.map((key) => {
        const user: AuthResponse = {
          id: key.author.id,
          name: key.author.name,
          email: key.author.email,
        };
        responseData.push({
          id: key.id,
          submitTime: key.submitTime,
          correctAnswer: key.correctTests,
          totalAnswer: key.totalTests,
          type: key.type,
          user: user,
        });
      });
      responseSuccess(
        res,
        StatusCodes.OK,
        true,
        "Successfully Fetch Data",
        responseData
      );
    } catch (error) {
      responseError(res, false, error);
    }
  }

  async getAllSubmission(req: Request, res: Response) {
    try {
      const userId = await getSessionUserId(req);
      const data = await this.submissionService.getAllSubmission();
      const responseData: UserSubmissionResponse[] = [];
      data.map((key) => {
        const user: AuthResponse = {
          id: key.author.id,
          name: key.author.name,
          email: key.author.email,
        };
        responseData.push({
          id: key.id,
          submitTime: key.submitTime,
          correctAnswer: key.correctTests,
          totalAnswer: key.totalTests,
          type: key.type,
          user: user,
        });
      });
      responseSuccess(
        res,
        StatusCodes.OK,
        true,
        "Successfully Fetch Data",
        responseData
      );
    } catch (error) {
      responseError(res, false, error);
    }
  }

  async gradeSubmission(req: Request, res: Response) {
    try {
      const submissionId = req.params.id;
      const userId = await getSessionUserId(req);
      const data = await this.submissionService.gradeSubmission(
        submissionId,
        Number(userId)
      );
      responseSuccess(
        res,
        StatusCodes.OK,
        true,
        "Submission graded successfully",
        data
      );
    } catch (error) {
      responseError(res, false, error);
    }
  }
}
