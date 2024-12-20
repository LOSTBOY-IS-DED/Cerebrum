require("dotenv").config();
const jwt = require("jsonwebtoken");
import { Request, Response, NextFunction } from "express";
import { Users } from "../model/Schema";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).json({
      success: false,
      message: "No token provided ...",
    });
  }
  try {
    const decode = jwt.verify(token as string, process.env.SECRET_KEY);
    // console.log("Decoded Token:", decode); // Log the decoded token to verify its contents
    //@ts-ignore
    const username = (decode as any).username;
    const user = await Users.findOne({ username });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    req.userId = decode._id;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid Token!!!",
    });
  }
};
