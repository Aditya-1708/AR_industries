import { Router } from "express";
import prisma from "../helper/pooler.js";
import { authenticate } from "../middlewares/authenticate.js";
import fs from "fs";
import path from "path";
const staffRouter = Router();

/**
 * CREATE STAFF
 */
import { createUploader } from "../middlewares/upload.js";

const uploadStaffImage = createUploader("data/uploads/staff", [
  "image/jpeg",
  "image/png",
  "image/webp",
]);

staffRouter.post(
  "/",
  authenticate,
  uploadStaffImage.single("image"),
  async (req, res) => {
    try {
      const { name, role } = req.body;

      if (!name || !role) {
        return res.status(400).json({ message: "Name and role are required" });
      }
      const img = req.file ? `staff/${req.file.filename}` : null;

      const staff = await prisma.staff.create({
        data: {
          name,
          role,
          image: img,
        },
      });

      res.status(201).json(staff);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

/**
 * GET ALL STAFF
 */
staffRouter.get("/", async (_, res) => {
  const staff = await prisma.staff.findMany({
    orderBy: { createdAt: "asc" },
  });
  res.json(staff);
});

/**
 * GET SINGLE STAFF
 */
staffRouter.get("/:id", async (req, res) => {
  const id = Number(req.params.id);

  const staff = await prisma.staff.findUnique({ where: { id } });
  if (!staff) return res.status(404).json({ message: "Staff not found" });

  res.json(staff);
});

/**
 * UPDATE STAFF
 */
staffRouter.put(
  "/:id",
  authenticate,
  uploadStaffImage.single("image"),
  async (req, res) => {
    try {
      const id = Number(req.params.id);
      const { name, role } = req.body;

      const existing = await prisma.staff.findUnique({ where: { id } });
      if (!existing) {
        return res.status(404).json({ message: "Staff not found" });
      }

      // delete old image if replaced
      if (req.file && existing.image) {
        fs.unlinkSync(path.join("data/uploads/staff", existing.image));
      }

      const updated = await prisma.staff.update({
        where: { id },
        data: {
          name: name ?? existing.name,
          role: role ?? existing.role,
          image: req.file ? `staff/${req.file.filename}` : existing.image,
        },
      });

      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

/**
 * DELETE STAFF
 */
staffRouter.delete("/:id", authenticate, async (req, res) => {
  try {
    const id = Number(req.params.id);

    const staff = await prisma.staff.findUnique({ where: { id } });
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    if (staff.image) {
      fs.unlinkSync(path.join("data/uploads/staff", staff.image));
    }

    await prisma.staff.delete({ where: { id } });

    res.json({ message: "Staff deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default staffRouter;
