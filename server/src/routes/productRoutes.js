import express from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { authenticate } from "../middlewares/authenticate.js";
import prisma from "../helper/pooler.js";

const productRouter = express.Router();

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

// Create a new product with image upload
productRouter.post(
  "/add",
  authenticate,
  upload.single("img"),
  async (req, res) => {
    const { name, description, price, stock } = req.body;
    const img = req.file ? `${uploadDir}${req.file.filename}` : ""; // Store image path

    try {
      const product = await prisma.product.create({
        data: { name, description, price, stock, img },
      });
      res.status(201).json(product); // Send back the created product
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error creating product" });
    }
  }
);

// Get all products
productRouter.get("/get/all", async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.status(200).json(products); // Send all products
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching products" });
  }
});

// Get a single product by ID
productRouter.get("/get/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });
    if (product) {
      res.status(200).json(product); // Send the product details
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching product" });
  }
});

// Update a product by ID
productRouter.put("/update/:id", upload.single("img"), async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock } = req.body;
  const updateData = {
    name,
    description,
    price: parseFloat(price),
    stock: parseInt(stock),
  };
  if (req.file) {
    updateData.img = req.file.filename;
  }
  try {
    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: updateData,
    });
    res.status(200).json(product); // Send the updated product
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating product" });
  }
});

// Delete a product by ID

productRouter.delete("/delete/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    // Find product first
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Delete image file if exists
    if (product.img) {
      const imagePath = path.join(
        process.cwd(),
        "../data/uploads",
        product.img
      );
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image file:", err);
        }
      });
    }

    // Delete product from DB
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
