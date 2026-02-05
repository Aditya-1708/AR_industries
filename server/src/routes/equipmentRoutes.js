import express from "express";
import fs from "fs";
import path from "path";
import { authenticate } from "../middlewares/authenticate.js";
import prisma from "../helper/pooler.js";
import { createUploader } from "../middlewares/upload.js";

const equipmentRouter = express.Router();

const uploadEquipmentImage = createUploader("data/uploads/equipments", [
  "image/jpeg",
  "image/png",
  "image/webp",
]);

// ================= ROUTES =================

/**
 * CREATE equipment (with image upload)
 */
equipmentRouter.post(
  "/",
  authenticate,
  uploadEquipmentImage.single("image"),
  async (req, res) => {
    const { name, details, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const image = req.file ? `equipments/${req.file.filename}` : null;

    try {
      const equipment = await prisma.equipment.create({
        data: {
          name,
          details,
          description,
          image,
        },
      });

      res.status(201).json(equipment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error creating equipment" });
    }
  },
);

/**
 * GET all equipments
 */
equipmentRouter.get("/", async (req, res) => {
  try {
    const equipments = await prisma.equipment.findMany({
      orderBy: { createdAt: "asc" },
    });

    res.status(200).json(equipments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching equipments" });
  }
});

/**
 * GET single equipment
 */
equipmentRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const equipment = await prisma.equipment.findUnique({
      where: { id: Number(id) },
    });

    if (!equipment) {
      return res.status(404).json({ error: "Equipment not found" });
    }

    res.status(200).json(equipment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching equipment" });
  }
});

/**
 * UPDATE equipment (optionally replace image)
 */
equipmentRouter.put(
  "/:id",
  authenticate,
  uploadEquipmentImage.single("image"),
  async (req, res) => {
    const { id } = req.params;
    const { name, details, description } = req.body;

    try {
      const existing = await prisma.equipment.findUnique({
        where: { id: Number(id) },
      });

      if (!existing) {
        return res.status(404).json({ error: "Equipment not found" });
      }

      let image = existing.image;

      // if new image uploaded → delete old one
      if (req.file) {
        if (existing.image) {
          const oldImagePath = path.join(
            process.cwd(),
            "data/uploads",
            existing.image,
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        image = `equipments/${req.file.filename}`;
      }

      const equipment = await prisma.equipment.update({
        where: { id: Number(id) },
        data: {
          name,
          details,
          description,
          image,
        },
      });

      res.status(200).json(equipment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error updating equipment" });
    }
  },
);

/**
 * DELETE equipment (delete image too)
 */
equipmentRouter.delete("/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const equipment = await prisma.equipment.findUnique({
      where: { id: Number(id) },
    });

    if (!equipment) {
      return res.status(404).json({ error: "Equipment not found" });
    }

    if (equipment.image) {
      const imagePath = path.join(
        process.cwd(),
        "data/uploads",
        equipment.image,
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await prisma.equipment.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: "Equipment deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting equipment" });
  }
});

export default equipmentRouter;
