import { Router } from "express";
import prisma from "../helper/pooler.js";
import { authenticate } from "../middlewares/authenticate.js";

const openingRouter = Router();

/* ================= CREATE JOB ================= */
openingRouter.post("/", async (req, res) => {
  try {
    const { title, description, requirements, salary, isActive } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ error: "Title and description are required" });
    }

    const job = await prisma.jobOpening.create({
      data: {
        title,
        description,
        requirements: Array.isArray(requirements)
          ? requirements
          : typeof requirements === "string"
            ? requirements.split(",").map((r) => r.trim())
            : [],
        salary: salary ? parseInt(salary) : null,
        isActive: isActive ?? true,
      },
    });

    res.status(201).json(job);
  } catch (error) {
    console.error("CREATE JOB ERROR:", error);
    res.status(500).json({ error: "Failed to create job opening" });
  }
});

/* ================= GET ALL JOBS ================= */
openingRouter.get("/", async (req, res) => {
  try {
    const jobs = await prisma.jobOpening.findMany({
      orderBy: { postedAt: "desc" },
    });

    res.json({ jobs });
  } catch (error) {
    console.error("FETCH JOBS ERROR:", error);
    res.status(500).json({ error: "Failed to fetch job openings" });
  }
});

/* ================= GET SINGLE JOB ================= */
openingRouter.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "Invalid job id" });
    }

    const job = await prisma.jobOpening.findUnique({
      where: { id },
    });

    if (!job) {
      return res.status(404).json({ error: "Job opening not found" });
    }

    res.json({ job });
  } catch (error) {
    console.error("FETCH JOB ERROR:", error);
    res.status(500).json({ error: "Failed to fetch job opening" });
  }
});

/* ================= UPDATE JOB ================= */
openingRouter.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, description, requirements, salary, isActive } = req.body;

    const updates = {};

    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;

    if (requirements !== undefined) {
      updates.requirements = Array.isArray(requirements)
        ? requirements
        : requirements.split(",").map((r) => r.trim());
    }

    if (salary !== undefined) updates.salary = salary ? parseInt(salary) : null;
    if (isActive !== undefined) updates.isActive = isActive;

    const job = await prisma.jobOpening.update({
      where: { id },
      data: updates,
    });

    res.json(job);
  } catch (error) {
    console.error("UPDATE JOB ERROR:", error);

    if (error.code === "P2025") {
      return res.status(404).json({ error: "Job opening not found" });
    }

    res.status(500).json({ error: "Failed to update job opening" });
  }
});

/* ================= DELETE JOB ================= */
openingRouter.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.jobOpening.delete({
      where: { id },
    });

    res.json({ message: "Job opening deleted successfully" });
  } catch (error) {
    console.error("DELETE JOB ERROR:", error);

    if (error.code === "P2025") {
      return res.status(404).json({ error: "Job opening not found" });
    }

    res.status(500).json({ error: "Failed to delete job opening" });
  }
});

export default openingRouter;
