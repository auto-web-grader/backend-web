import db from "../config/ConnectDb";

export class SubmissionRepository {
    async createSubmission(data: { path: string, type: string, authorId: number }) {
        return db.submission.create({
            data: {
                path: data.path,
                type: data.type,
                author: {
                    connect: { id: data.authorId }
                }
            }
        });
    }
}