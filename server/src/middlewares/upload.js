import multer from "multer";
import path from "path";
import fs from "fs";

export function createUploader(folder, allowedTypes = []) {
  const uploadDir = path.join(process.cwd(), folder);

  // Ensure folder exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const filename = Date.now() + ext;
      cb(null, filename);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (allowedTypes.length === 0) return cb(null, true);

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"), false);
    }
  };

  return multer({ storage, fileFilter });
}
