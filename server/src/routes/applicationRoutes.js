import { Router } from "express";
import prisma from "../helper/pooler.js";
import { authenticate } from "../middlewares/authenticate.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const applicationRouter = Router();

const uploadDir = path.join(process.cwd(), "../data/uploads/resumes");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [".pdf", ".docx"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only .pdf and .docx files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

applicationRouter.post(
  "/apply",
  authenticate,
  upload.single("resume"),
  async (req, res) => {
    try {
      const { jobId } = req.body;
      const userId = req.user.userId;
      console.log("BODY:", req.body);
      console.log("USER:", req.user);

      if (!jobId || !req.file) {
        return res
          .status(400)
          .json({ message: "Job ID and resume are required" });
      }

      const application = await prisma.jobApplication.create({
        data: {
          jobId: parseInt(jobId),
          userId,
          resumeLoc: req.file.path,
        },
      });

      res.status(201).json({
        message: "Application submitted successfully",
        application,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error submitting application" });
    }
  }
);

applicationRouter.get("/read/userId", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const applications = await prisma.jobApplication.findMany({
      where: { userId },
    });
    if (!applications.length) {
      return res
        .status(404)
        .json({ message: "No applications found for this user" });
    }
    res.status(200).json({
      message: "Applications retrieved successfully",
      applications,
    });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving applications" });
  }
});

applicationRouter.get("/read/:jobId", authenticate, async (req, res) => {
  try {
    const jobId = parseInt(req.params.jobId);
    const applications = await prisma.jobApplication.findMany({
      where: { jobId },
    });

    if (!applications.length) {
      return res
        .status(404)
        .json({ message: "No applications found for this job" });
    }

    res.status(200).json({
      message: "Applications retrieved successfully",
      applications,
    });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving applications" });
  }
});

export default applicationRouter;
