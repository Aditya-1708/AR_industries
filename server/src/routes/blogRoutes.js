import { Router } from "express";
import prisma from "../helper/pooler.js";
import { authenticate } from "../middlewares/authenticate.js";
import { createUploader } from "../middlewares/upload.js";

const blogRouter = Router();

/* ================= UPLOAD CONFIG ================= */

// For thumbnail + cover
const uploadBlogImages = createUploader("data/uploads/blogs", [
  "image/jpeg",
  "image/png",
  "image/webp",
]);

// For images inside editor
const uploadEditorImage = createUploader("data/uploads/editor", [
  "image/jpeg",
  "image/png",
  "image/webp",
]);

/* ================= PUBLIC GET ROUTES ================= */

// Get all published blogs
blogRouter.get("/", async (req, res) => {
  try {
    const blogs = await prisma.blog.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    });

    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});

// Get single blog by ID
blogRouter.get("/:id", async (req, res) => {
  try {
    const blog = await prisma.blog.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blog" });
  }
});

/* ================= EDITOR IMAGE UPLOAD ================= */

blogRouter.post(
  "/editor-image",
  authenticate,
  uploadEditorImage.single("file"),
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Store public path
      const fileUrl = "/uploads/editor/" + req.file.filename;

      res.json({
        result: [
          {
            url: fileUrl,
            name: req.file.filename,
            size: req.file.size,
          },
        ],
      });
    } catch (err) {
      res.status(500).json({ error: "Image upload failed" });
    }
  },
);

/* ================= PROTECTED ROUTES ================= */

// Create blog
blogRouter.post(
  "/",
  authenticate,
  uploadBlogImages.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, content, published } = req.body;

      // Basic validation
      if (!title || !title.trim()) {
        return res.status(400).json({ error: "Title is required" });
      }

      const thumbnailFile = req.files?.thumbnail?.[0];
      const coverFile = req.files?.cover?.[0];

      if (!thumbnailFile || !coverFile) {
        return res.status(400).json({
          error: "Thumbnail and cover images are required",
        });
      }

      const thumbnailPath = "/uploads/blogs/" + thumbnailFile.filename;
      const coverPath = "/uploads/blogs/" + coverFile.filename;

      const blog = await prisma.blog.create({
        data: {
          title: title.trim(),
          content: content || "",
          published:
            published === "true" || published === true || published === "1",
          thumbnail: thumbnailPath,
          cover: coverPath,
        },
      });

      res.status(201).json({
        success: true,
        message: "Blog created successfully",
        blog,
      });
    } catch (err) {
      // Detailed logging for debugging
      console.error("❌ Blog creation failed:");
      console.error("Error message:", err.message);
      console.error("Stack:", err.stack);

      // Prisma-specific error logging (optional)
      if (err.code) {
        console.error("Prisma error code:", err.code);
      }

      res.status(500).json({
        success: false,
        error: "Failed to create blog",
      });
    }
  },
);

// Update blog
blogRouter.put(
  "/:id",
  authenticate,
  uploadBlogImages.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { title, content, published } = req.body;

      const thumbnailFile = req.files?.thumbnail?.[0];
      const coverFile = req.files?.cover?.[0];

      const updateData = {
        title,
        content,
        published: published === "true" || published === true,
      };

      if (thumbnailFile) {
        updateData.thumbnail = "/uploads/blogs/" + thumbnailFile.filename;
      }

      if (coverFile) {
        updateData.cover = "/uploads/blogs/" + coverFile.filename;
      }

      const blog = await prisma.blog.update({
        where: { id: Number(id) },
        data: updateData,
      });

      res.json(blog);
    } catch (err) {
      res.status(500).json({ error: "Failed to update blog" });
    }
  },
);

// Delete blog
blogRouter.delete("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.blog.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete blog" });
  }
});

export default blogRouter;
