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

applicationRouter.post("/", upload.single("resume"), async (req, res) => {
  try {
    const { jobId, fullName, email, phoneNo, wswhy } = req.body;

    if (!jobId || !req.file) {
      return res
        .status(400)
        .json({ message: "Job ID and resume are required" });
    }
    const parsedJobId = Number(jobId);
    if (Number.isNaN(parsedJobId)) {
      return res.status(400).json({ message: "Invalid jobId" });
    }

    const application = await prisma.jobApplication.create({
      data: {
        jobId: parsedJobId,
        fullName,
        email,
        phoneNo,
        wswhy: wswhy || "",
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
});

applicationRouter.get("/", authenticate, async (req, res) => {
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

applicationRouter.get("/:jobId", authenticate, async (req, res) => {
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

applicationRouter.delete("/:id", authenticate, async (req, res) => {
  const id = ParseInt(req.params.applicationId);
  try {
    const deletedApplication = await prisma.application.delete({
      where: { id },
    });
    res.status(200).json({ deletedApplication });
  } catch (error) {
    res.status(400).json(error);
  }
});

export default applicationRouter;
