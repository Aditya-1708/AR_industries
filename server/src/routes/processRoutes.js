import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import prisma from "../helper/pooler.js";

const processRouter = express.Router();

/**
 * CREATE process
 */
processRouter.post("/", authenticate, async (req, res) => {
  const { name, description, icon, highlights } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    const process = await prisma.process.create({
      data: {
        name,
        description,
        icon,
        highlights: highlights || [],
      },
    });

    res.status(201).json(process);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating process" });
  }
});

/**
 * GET all processes
 */
processRouter.get("/", async (req, res) => {
  try {
    const processes = await prisma.process.findMany({
      orderBy: { createdAt: "asc" },
    });
    res.status(200).json(processes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching processes" });
  }
});

/**
 * GET single process
 */
processRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const process = await prisma.process.findUnique({
      where: { id: Number(id) },
    });

    if (!process) {
      return res.status(404).json({ error: "Process not found" });
    }

    res.status(200).json(process);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching process" });
  }
});

/**
 * UPDATE process
 */
processRouter.put("/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const { name, description, icon, highlights } = req.body;

  try {
    const process = await prisma.process.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        icon,
        highlights,
      },
    });

    res.status(200).json(process);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating process" });
  }
});

/**
 * DELETE process
 */
processRouter.delete("/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.process.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: "Process deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting process" });
  }
});

export default processRouter;
