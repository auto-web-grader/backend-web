import express from "express";
import upload from "../config/MulterConfig";
import { SubmissionController } from "../controller/SubmissionController";
import { SubmissionService } from "../service/SubmissionService";
import { SubmissionRepository } from "../repository/SubmissionRepository";
import authMiddleware from "../middleware/AuthMiddleware";
import uploadTemp from "../config/UploadTempConfig";

const router = express.Router();
const submissionRepository = new SubmissionRepository();
const submissionService = new SubmissionService(submissionRepository);
const submissionController = new SubmissionController(submissionService);

router.get("/", authMiddleware(["student"]), (req, res) =>
  submissionController.getUserSubmission(req, res)
);

router.get("/all", authMiddleware(["admin"]), (req, res) =>
  submissionController.getAllSubmission(req, res)
)

router.post("/upload", authMiddleware(["student"]), upload.single("file"), (req, res) =>
  submissionController.uploadSubmission(req, res)
);

router.post("/grade/:id", authMiddleware(["admin"]), (req, res) =>
  submissionController.gradeSubmission(req, res)
);

router.post("/gradeStatistic", authMiddleware(["student"]), uploadTemp.single("file"), (req, res) => {
  submissionController.gradeSubmissionStatistic(req, res)
});

export default router;
