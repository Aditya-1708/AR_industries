import { Router } from "express";
import Joi from "joi";
import { authenticate } from "../middlewares/authenticate.js";
import insertAdmin from "../helper/insertAdmin.js";
import { generateToken } from "../helper/jwt.js";
import prisma from "../helper/pooler.js";
import { adminSchema } from "../helper/adminSchema.js";
import { verifyAdmin } from "../helper/verifyAdmin.js";

const adminRouter = Router();

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// ✅ Signup route
adminRouter.post("/signup", async (req, res) => {
  const { email, password, role } = req.body;

  const { error } = adminSchema.safeParse({
    email,
    password,
    role,
  });

  if (error) {
    return res.status(400).json({
      success: false,
      msg: error,
    });
  }

  try {
    const adminExists = await verifyAdmin(email, password);
    if (adminExists) {
      const token = generateToken({
        adminId: adminExists.id,
        email: adminExists.email,
      });
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "Lax",
        maxAge: 60 * 60 * 1000,
      });
      return res.json({ success: false, msg: "admin already exists" });
    }

    const createadmin = await insertAdmin(email, password, role);
    return res.status(200).json({ success: true, admin: createadmin });
  } catch (e) {
    console.error("❌ Signup Error:", e); // 👈 log the error
    return res.status(500).json({ success: false, msg: "Error during signup" });
  }
});

// ✅ Signin route
adminRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const { error } = loginSchema.validate({ email, password });
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    const admin = await verifyAdmin(email, password);
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken({ adminId: admin.id, email: admin.email });
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Lax",
      maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (e) {
    console.error("❌ Signin Error:", e); // 👈 log the error
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// ✅ Logout route
adminRouter.get("/logout", authenticate, async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "Lax",
    });
    res
      .status(200)
      .json({ success: true, message: "Logged out successfully!" });
  } catch (e) {
    console.error("❌ Logout Error:", e); // 👈 log the error
    res.status(500).json({ success: false, message: "Internal Server Error!" });
  }
});

// ✅ Me route
adminRouter.get("/me", authenticate, async (req, res) => {
  try {
    const adminId = req.admin.adminId;
    const admin = await prisma.admin.findFirst({
      where: { id: adminId },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });
    res.json({ success: true, admin });
  } catch (e) {
    console.error("❌ Me Route Error:", e); // 👈 log the error
    res.send({ success: false, msg: "Error in authenticating" });
  }
});

export default adminRouter;
