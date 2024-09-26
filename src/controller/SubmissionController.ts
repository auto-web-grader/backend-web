import { Request, Response } from "express";
import { SubmissionService } from "../service/SubmissionService";
import { FileRequest, GradeStatisticRequest, UserSubmissionResponse } from "../model/SubmissionModel";
import { getSessionUserId } from "../utils/GetUserSession";
import {
  responseError,
  responseSuccess,
  responseSuccessWithoutData,
} from "../utils/ApiResponse";
import { StatusCodes } from "http-status-codes";
import { AuthResponse } from "../model/AuthModel";
import { CustomError } from "../utils/ErrorHandling";
import axios from "axios";
import FormData from 'form-data'

export class SubmissionController {
  private submissionService: SubmissionService;

  constructor(submissionService: SubmissionService) {
    this.submissionService = submissionService;
  }
  async uploadSubmission(req: Request<any, any, FileRequest>, res: Response) {
    try {
      const file = req.file;
      const { type } = req.body;
      // console.log(file);
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

  async gradeSubmissionStatistic(req: Request<any, any, GradeStatisticRequest>, res: Response) {
      try {
        if (!req.file) {
          throw new CustomError(StatusCodes.BAD_REQUEST, "No file uploaded!");
        }

        const form = new FormData();

        form.append("scatter", req.file.buffer, {
            filename: req.file.originalname, 
            contentType: req.file.mimetype,
        });
        
        form.append("answer1", req.body.answer1);
        form.append("answer2", req.body.answer2);
        form.append("answer3", req.body.answer3);
        form.append("answer4", req.body.answer4);
        form.append("answer5", req.body.answer5);
        form.append("answer7", req.body.answer7);
        form.append("answer8", req.body.answer8);

        const userId = await getSessionUserId(req);

        const data = await this.submissionService.gradeSubmissionStatistic(form, Number(userId));

        responseSuccess(
          res,
          StatusCodes.OK,
          true,
          "Submission graded successfully",
          data,
        );
      } catch (error) {
        responseError(res, false, error);
      }
    
  }
}
