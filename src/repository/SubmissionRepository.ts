import db from "../config/ConnectDb";

export class SubmissionRepository {
  async createSubmission(data: {
    path: string;
    type: string;
    authorId: number;
  }) {
    return db.submission.create({
      data: {
        path: data.path,
        type: data.type,
        author: {
          connect: { id: data.authorId },
        },
      },
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
