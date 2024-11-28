require("dotenv").config();
const express = require("express");
import { Users } from "../model/Schema";
const bcrypt = require("bcrypt");
import { z } from "zod";
const jwt = require("jsonwebtoken");

const UserSchema = z.object({
  username: z
    .string()
    .min(3, "Username must have atleast 3 characters")
    .max(10, "Username should not have more than 10 characters"),
  password: z
    .string()
    .min(8, "password length should be 8 minimum")
    .max(20, "password length should be 20 maximum "),
});

const LoginSchema = z.object({
  username: z
    .string()
    .min(3, "Username must have atleast 3 characters")
    .max(10, "Username should not have more than 10 characters"),
  password: z
    .string()
    .min(8, "password length should be 8 minimum")
    .max(20, "password length should be 20 maximum "),
});

type User = z.infer<typeof UserSchema>;

const userRouter = express.Router();

userRouter.post("/signup", async (req: any, res: any) => {
  try {
    const parsedData = UserSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({
        success: false,
        message: "Validation Failed!!!",
        errors: parsedData.error.errors,
      });
    }
    const { username, password } = parsedData.data;

    const existingUser = await Users.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: " User Already exists try again with a different username",
      });
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      const newUser = new Users({
        username,
        password: hashPassword,
      });
      await newUser.save();
      return res.status(200).json({
        success: true,
        message: "Signed in successfully!!!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error occurred during sign-in",
    });
  }
});

userRouter.post("/signin", async (req: any, res: any) => {
  try {
    const parsedData = LoginSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({
        success: false,
        message: "Validate correctly",
        error: parsedData.error.errors,
      });
    }
    const { username, password } = parsedData.data;
    const existingUser = await Users.findOne({ username });
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found in the database try signup",
      });
    }
    const isPasswordMatch = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordMatch) {
      return res.status(404).json({
        success: false,
        message: "Wrong password!!!",
      });
    }
    const token = jwt.sign(
      { username: existingUser.username },
      process.env.SECRET_KEY
    );
    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export { userRouter };
