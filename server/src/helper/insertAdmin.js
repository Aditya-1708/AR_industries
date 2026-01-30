import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";
import prisma from "./pooler.js";

dotenv.config();

export default async function insertAdmin(email, password, role) {
  if (!email || !password ) {
    console.error("Missing required fields");
    throw new Error("All fields are required");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.error("Invalid email format");
    throw new Error("Invalid email format");
  }
  if (password.length < 8) {
    console.error("Password too short");
    throw new Error("Password must be at least 8 characters");
  }

  try {
    const saltRounds = parseInt(process.env.SALT_ROUNDS || "10", 10);
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newAdmin = await prisma.admin.create({
      data: {
        email: email.toLowerCase().trim(),
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
      },
    });

    return newAdmin;
  } catch (error) {
    console.error("Error creating Admin:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new Error("Email already exists");
      }
    }

    throw new Error("Failed to create Admin");
  }
}
