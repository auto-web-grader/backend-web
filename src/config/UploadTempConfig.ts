import multer from "multer";

const uploadTemp = multer({
    storage: multer.memoryStorage(),
});

export default uploadTemp;