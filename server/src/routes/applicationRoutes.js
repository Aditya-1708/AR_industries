import { Router } from "express";
import prisma from "../helper/pooler.js";
import path from "path";
import fs from "fs";
import { createUploader } from "../middlewares/upload.js";

const applicationRouter = Router();

/* ================= UPLOAD CONFIG ================= */

const uploadApplicationResume = createUploader("data/uploads/resumes", [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

/* ================= CREATE APPLICATION (PUBLIC) ================= */

applicationRouter.post("/", uploadApplicationResume.single("resume"), async (req, res) => {
  try {
    const { jobId, fullName, email, phoneNo, wswhy } = req.body;

    if (!jobId || !fullName || !email || !phoneNo || !req.file) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const application = await prisma.jobApplication.create({
      data: {
        jobId: Number(jobId),
        fullName,
        email,
        phoneNo,
        wswhy: wswhy || "",
        resume: `resumes/${req.file.filename}`, // ✅ relative path
      },
    });

    res.status(201).json(application);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to submit application" });
  }
});

/* ================= ADMIN: GET ALL APPLICATIONS ================= */

applicationRouter.get("/", async (req, res) => {
  try {
    const applications = await prisma.jobApplication.findMany({
      include: {
        job: { select: { title: true } },
      },
      orderBy: { appliedAt: "desc" },
    });

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch applications" });
  }
});

/* ================= ADMIN: GET APPLICATIONS BY JOB ================= */

applicationRouter.get("/job/:jobId", async (req, res) => {
  try {
    const applications = await prisma.jobApplication.findMany({
      where: { jobId: Number(req.params.jobId) },
      orderBy: { appliedAt: "desc" },
    });

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch applications" });
  }
});

/* ================= ADMIN: DELETE APPLICATION ================= */

applicationRouter.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const application = await prisma.jobApplication.findUnique({
      where: { id },
    });
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // delete resume file
    const filePath = path.join(
      process.cwd(),
      "data/uploads",
      application.resume,
    );
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await prisma.jobApplication.delete({ where: { id } });

    res.json({ message: "Application deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete application" });
  }
});

export default applicationRouter;
