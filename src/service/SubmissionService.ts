import path from "path";
import fs from "fs";
import extractZipFile from "../utils/file/ExtractZipFile";
import { SubmissionRepository } from "../repository/SubmissionRepository";

export class SubmissionService {
    private submissionRepository: SubmissionRepository;

    constructor(submissionRepository: SubmissionRepository) {
        this.submissionRepository = submissionRepository;
    }

    async uploadSubmission (baseFilepath: string, type: string, userId: number) {
        try {
            const currentDirectory = process.cwd();
            const fileExtension = path.extname(baseFilepath);

            const fileName = Date.now().toString();
            const extractTo = path.join(currentDirectory, process.env.UPLOAD_DIR, fileName);

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
            }

            const newSubmission = await this.submissionRepository.createSubmission (submissionData); 

        } catch (error) {
            throw new Error(`Error processing file: ${error.message}`);
        }

    }
}