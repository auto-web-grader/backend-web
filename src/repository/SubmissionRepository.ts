import { PROXY_AUTHENTICATION_REQUIRED } from "http-status-codes";
import db from "../config/ConnectDb";

export class SubmissionRepository {
  async createSubmission(data: {
    path: string;
    type: string;
    authorId: number;
    correctTests?: number;
    totalTests?: number;
  }) {
    const submissionData: any = {
      path: data.path,
      type: data.type,
      authorId: data.authorId,
    };

    if (data.correctTests && data.totalTests) {
      submissionData.correctTests = data.correctTests;
      submissionData.totalTests = data.totalTests;
    }
    return db.submission.create({
      data: submissionData,
    });
  }

  async getSubmissionByUserId(userId: number) {
    return db.submission.findMany({
      where: {
        authorId: userId,
      },
      include: {
        author: true,
      },
      orderBy: {
        submitTime: "desc",
      },
    });
  }

  async getSubmissionById(id: number) {
    return db.submission.findUnique({
      where: {
        id,
      },
    });
  }

  async getAllSubmission() {
    return db.submission.findMany(({
      include: {
        author: true,
      }
    }));
  }

  async updateGradeById(id: number, correctTest: number, totalTest: number) {
    return db.submission.update({
      where: {
        id,
      },
      data: {
        correctTests: correctTest,
        totalTests: totalTest,
      },
    });
  }
}
