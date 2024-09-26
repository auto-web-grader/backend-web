import path from "path";
import fs from "fs";
import extractZipFile from "../utils/file/ExtractZipFile";
import { SubmissionRepository } from "../repository/SubmissionRepository";
import { CustomError } from "../utils/ErrorHandling";
import { StatusCodes } from "http-status-codes";
import { promisify } from "util";
import { exec } from "child_process";
import axios from "axios";
import FormData from 'form-data'

export class SubmissionService {
  private submissionRepository: SubmissionRepository;

  constructor(submissionRepository: SubmissionRepository) {
    this.submissionRepository = submissionRepository;
  }

  async uploadSubmission(baseFilepath: string, type: string, userId: number) {
    try {
      const currentDirectory = process.cwd();
      const fileExtension = path.extname(baseFilepath);

      const fileName = Date.now().toString();
      const extractTo = path.join(
        currentDirectory,
        process.env.UPLOAD_DIR,
        fileName
      );

      if (fileExtension === ".zip") {
        await extractZipFile(baseFilepath, extractTo);
      } else {
        await fs.promises.mkdir(extractTo, { recursive: true });
        const newFilePath = path.join(extractTo, path.basename(baseFilepath));
        await fs.promises.rename(baseFilepath, newFilePath);
      }
      const submissionData = {
        path: extractTo,
        type: type,
        authorId: userId,
      };

      const newSubmission = await this.submissionRepository.createSubmission(
        submissionData
      );
    } catch (error) {
      throw new Error(`Error processing file: ${error.message}`);
    }
  }

  async getUserSubmission(userId: number) {
    try {
      const submissions = await this.submissionRepository.getSubmissionByUserId(
        userId
      );
      return submissions;
    } catch (error) {
      throw new CustomError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to load User Submission",
        error
      );
    }
  }

  async getAllSubmission() {
    try {
      const submissions = await this.submissionRepository.getAllSubmission();
      return submissions;
    } catch (error) {
      throw new CustomError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to load User Submission",
        error
      );
    }
  }

  async gradeSubmission(submissionId: string, userId: number) {
    try {
      const submissionData = await this.submissionRepository.getSubmissionById(
        Number(submissionId)
      );
      if (!submissionData) {
        throw new CustomError(
          StatusCodes.NOT_FOUND,
          "Submission data not found"
        );
      }
      const type = Number(submissionData.type);
      const cwd = process.cwd();
      if (type == 1) {
        const scripts = `${cwd}/scripts/web-grading.sh ${submissionData.path}`;
        const execPromise = promisify(exec);
        await execPromise(scripts).catch((error) => {
          throw new CustomError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            "Error in executing scripts",
            error
          );
        });

        const cypressOutput = fs.readFileSync(
          `${submissionData.path}/output.txt`,
          "utf8"
        );

        const totalTestsMatch = cypressOutput.match(/Tests:\s+(\d+)/);
        const passingTestsMatch = cypressOutput.match(/Passing:\s+(\d+)/);

        const totalTests = totalTestsMatch
          ? parseInt(totalTestsMatch[1], 10)
          : 0;
        const passingTests = passingTestsMatch
          ? parseInt(passingTestsMatch[1], 10)
          : 0;
        const update = this.submissionRepository.updateGradeById(
          submissionData.id,
          passingTests,
          totalTests,
        );
        return update;
      } else if (type == 2) {
        const testsPath = `${cwd}/tests/reverseString.test.js`;
        const scripts = `${cwd}/scripts/unittest-grading.sh ${testsPath} ${submissionData.path}`;
        const execPromise = promisify(exec);
        await execPromise(scripts);

        const testOutput = fs.readFileSync(
          `${submissionData.path}/output.txt`,
          "utf8"
        );

        const passedTestsRegex = /Tests:\s+\d+ passed, (\d+) total/;
        const totalTestsRegex = /Tests:\s+(\d+) passed, \d+ total/;

        const passedTestsMatch = testOutput.match(passedTestsRegex);
        const totalTestsMatch = testOutput.match(totalTestsRegex);

        const passedTests = passedTestsMatch
          ? parseInt(passedTestsMatch[1], 10)
          : null;
        const totalTests = totalTestsMatch
          ? parseInt(totalTestsMatch[1], 10)
          : null;

        const update = this.submissionRepository.updateGradeById(
          submissionData.id,
          passedTests,
          totalTests
        );
        return update;
      }
    } catch (error) {
      throw new CustomError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        error.message ?? "Grading server error",
        error
      );
    }
  }

  async gradeSubmissionStatistic(form: FormData, userId: number) {
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/submit-answers', form, {
        headers: {
          ...form.getHeaders(),
        }
      })

      const submissionData = {
        path: "-",
        type: "3",
        authorId: userId,
        correctTests: response.data.score,
        totalTests: 100,
      };

      const data = this.submissionRepository.createSubmission(
        submissionData,
      )

      return data;
    } catch (error) {
      throw new CustomError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        error.message ?? "Grading server error",
        error
      );
    }



  }
}
