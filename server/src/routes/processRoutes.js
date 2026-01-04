import express from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { authenticate } from "../middlewares/authenticate.js";
import prisma from "../helper/pooler.js";

const processRouter = express.Router();

// Set up multer to store files in the 'uploads' directory
const uploadDir = path.join(process.cwd(), "data/uploads/images");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Folder where the image will be stored
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + ext; // Unique filename based on timestamp
    cb(null, filename);
  },
});

const upload = multer({ storage });



// Create a new process with image upload
processRouter.post("/",authenticate, upload.single("img"), async (req, res) => {
    const { name, description } = req.body;
    const img = req.file ? `${uploadDir}${req.file.filename}` : "";
    try {
      const process = await prisma.process.create({
        data: { name, description, img },
      });
      res.status(201).json(process);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error creating process" });
    }
});



// Get all processes
processRouter.get("/", async (req, res) => {
  try {
    const processes = await prisma.process.findMany();
    res.status(200).json(processes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching processes" });
  }
});



// Get a single process by ID
processRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const process = await prisma.process.findUnique({
      where: { id: Number(id) },
    });
    if (process) {
      res.status(200).json(process);
    } else {
      res.status(404).json({ error: "process not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching process" });
  }
});;


// Update a process by ID
processRouter.put("/:id",authenticate, upload.single("img"), async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const updateData = {
    name,
    description,
  };
  if (req.file) {
    updateData.img = req.file.filename;
  }
  try {
    const process = await prisma.process.update({
      where: { id: Number(id) },
      data: updateData,
    });
    res.status(200).json(process);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating process" });
  }
});



// Delete a process by ID
processRouter.delete("/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const process = await prisma.process.findUnique({
      where: { id: Number(id) },
    });

    if (!process) {
      return res.status(404).json({ error: "process not found" });
    }
    if (process.img) {
      const imagePath = path.join(
        process.cwd(),
        "/data/uploads",
        process.img
      );
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image file:", err);
        }
      });
    }
    await prisma.process.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: "process and image deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting process" });
  }
});

export default processRouter;
