import fs from "fs";
import unzipper from "unzipper";

function extractZipFile (zipFilePath: string, extractTo: string): Promise<void> {
    return new Promise((resolve, reject) => {
        fs.createReadStream(zipFilePath)
        .pipe(unzipper.Extract({ path: extractTo }))
        .on("close", () => {
            fs.unlinkSync(zipFilePath);
            resolve();
        })
        .on("error", (err: NodeJS.ErrnoException) => {
            reject(err);
        });
    });
}

export default extractZipFile;