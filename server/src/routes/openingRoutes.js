import { Router } from "express";
import prisma from "../helper/pooler.js";
import { authenticate } from "../middlewares/authenticate.js";

const openingRouter = Router();
openingRouter.post("/create", authenticate, async (req, res) => {
  try {
    const { title, description, openings, salary, isActive } = req.body;

    const job = await prisma.jobOpening.create({
      data: {
        title,
        description,
        openings: parseInt(openings),
        salary: parseFloat(salary),
        isActive,
      },
    });

    res.status(201).json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create job opening" });
  }
});

openingRouter.get("/read", async (req, res) => {
  try {
    const jobs = await prisma.jobOpening.findMany({
      orderBy: { postedAt: "desc" },
    });
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch job openings" });
  }
});

openingRouter.get("/read/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const job = await prisma.jobOpening.findUnique({
      where: { id: parseInt(id) },
    });

    if (!job) {
      return res.status(404).json({ error: "Job opening not found" });
    }

    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch job opening" });
  }
});

openingRouter.put("/update/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, openings, salary, isActive } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (openings !== undefined) updates.openings = parseInt(openings);
    if (salary !== undefined) updates.salary = parseInt(salary);
    if (isActive !== undefined) updates.isActive = isActive;

    const job = await prisma.jobOpening.update({
      where: { id: parseInt(id) },
      data: updates,
    });

    res.json(job);
  } catch (error) {
    console.error(error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Job opening not found" });
    }
    res.status(500).json({ error: "Failed to update job opening" });
  }
});

openingRouter.delete("/delete/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.jobOpening.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Job opening deleted successfully" });
  } catch (error) {
    console.error(error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Job opening not found" });
    }
    res.status(500).json({ error: "Failed to delete job opening" });
  }
});

export default openingRouter;
