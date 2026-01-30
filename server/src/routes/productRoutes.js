import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import prisma from "../helper/pooler.js";

const productRouter = express.Router();

/**
 * CREATE product
 */
productRouter.post("/", authenticate, async (req, res) => {
  const { name, description, icon, highlights } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        icon,
        highlights: highlights || [],
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating product" });
  }
});

/**
 * GET all productes
 */
productRouter.get("/", async (req, res) => {
  try {
    const productes = await prisma.product.findMany({
      orderBy: { createdAt: "asc" },
    });
    res.status(200).json(productes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching productes" });
  }
});

/**
 * GET single product
 */
productRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });

    if (!product) {
      return res.status(404).json({ error: "product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching product" });
  }
});

/**
 * UPDATE product
 */
productRouter.put("/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const { name, description, icon, highlights } = req.body;

  try {
    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        icon,
        highlights,
      },
    });

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating product" });
  }
});

/**
 * DELETE product
 */
productRouter.delete("/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.product.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: "product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting product" });
  }
});

export default productRouter;
