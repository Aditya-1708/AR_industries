import { Router } from "express";
import prisma from "../helper/pooler.js";
import { userSchema } from "../helper/userSchema.js";
import insertUser from "../helper/insertUser.js";
import { verifyUser } from "../helper/verifyUser.js";
import { generateToken } from "../helper/jwt.js";
import { authenticate } from "../middlewares/authenticate.js";import Joi from "joi";

const userRouter = Router();

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// ✅ Signup route
userRouter.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  const { error } = userSchema.safeParse({
    firstName,
    lastName,
    email,
    password,
  });

  if (error) {
    return res.status(400).json({
      success: false,
      msg: error.details[0].message,
    });
  }

  try {
    const userExists = await verifyUser(email, password);
    if (userExists) {
      const token = generateToken({
        userId: userExists.id,
        email: userExists.email,
      });
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "Lax",
        maxAge: 60 * 60 * 1000,
      });
      return res.json({ success: false, msg: "User already exists" });
    }

    const createUser = await insertUser(firstName, lastName, email, password, role);
    return res.status(200).json({ success: true, user: createUser });
  } catch (e) {
    console.error("❌ Signup Error:", e); // 👈 log the error
    return res.status(500).json({ success: false, msg: "Error during signup" });
  }
});

// ✅ Signin route
userRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const { error } = loginSchema.validate({ email, password });
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    const user = await verifyUser(email, password);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken({ userId: user.id, email: user.email });
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Lax",
      maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName, // ✅ fixed
        email: user.email,
        isAdmin: user.isAdmin,
        role: user.role,
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
userRouter.get("/logout", authenticate, async (req, res) => {
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
userRouter.get("/me", authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await prisma.user.findFirst({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isAdmin: true,
      },
    });
    res.json({ success: true, user });
  } catch (e) {
    console.error("❌ Me Route Error:", e); // 👈 log the error
    res.send({ success: false, msg: "Error in authenticating" });
  }
});

export default userRouter;
