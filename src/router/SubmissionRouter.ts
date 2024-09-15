import express from "express";
import upload from "../config/MulterConfig"
import { SubmissionController } from "../controller/SubmissionController";
import { SubmissionService } from "../service/SubmissionService";
import { SubmissionRepository } from "../repository/SubmissionRepository";
import authMiddleware from "../middleware/AuthMiddleware";

const router = express.Router();
const submissionRepository = new SubmissionRepository();
const submissionService = new SubmissionService(submissionRepository);
const submissionController = new SubmissionController(submissionService);

router.post("/upload", authMiddleware, upload.single("file"), (req, res) => submissionController.post(req, res));

export default router;