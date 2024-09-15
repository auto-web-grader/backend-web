import { Request, Response } from "express";
import { SubmissionService } from "../service/SubmissionService";
import { FileRequest } from "../model/SubmissionModel";
import { getSessionUserId } from "../utils/GetUserSession";

export class SubmissionController{
    private submissionService: SubmissionService;

    constructor (submissionService: SubmissionService) {
        this.submissionService = submissionService;
    }
    async post (req: Request<any, any, FileRequest>, res: Response) {
        try {
            const file = req.file;
            const { type } = req.body;
            console.log(file)
            if (!file) {
                return res.status(400).json({
                    message: "No file uploaded",
                });
            }
            const result = this.submissionService.uploadSubmission(file.path, type, Number(getSessionUserId(req)));
            res.status(200).json({
                message: "File uploaded successfully",
            });
        } catch (error) {
            res.status(400).json({
                message: error.message,
            });
        }
    }
}