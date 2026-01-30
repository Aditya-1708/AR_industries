import express from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { authenticate } from "../middlewares/authenticate.js";
import prisma from "../helper/pooler.js";

const productRouter = express.Router();

// Set up multer to store files in the 'uploads' directory
const uploadDir = path.join(process.cwd(), "data/uploads/products");

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

// Create a new product with image upload
productRouter.post(
  "/",
  authenticate,
  upload.single("img"),
  async (req, res) => {
    const { name, description } = req.body;
    const img = req.file ? `products/${req.file.filename}` : null;
    try {
      const product = await prisma.product.create({
        data: { name, description, img },
      });
      res.status(201).json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error creating product" });
    }
  },
);

// Get all products
productRouter.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching products" });
  }
});

// Get a single product by ID
productRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching product" });
  }
});

// Update a product by ID
productRouter.put(
  "/:id",
  upload.single("img"),
  async (req, res) => {
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
      const product = await prisma.product.update({
        where: { id: Number(id) },
        data: updateData,
      });
      res.status(200).json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error updating product" });
    }
  },
);

// Delete a product by ID
productRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    if (product.img) {
      const imagePath = path.join(process.cwd(), "/data/products", product.img);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image file:", err);
        }
      });
    }
    await prisma.product.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: "Product and image deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting product" });
  }
});

export default productRouter;
