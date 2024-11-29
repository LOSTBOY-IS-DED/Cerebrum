require("dotenv").config();

const express = require("express");
const z = require("zod");
import { Content } from "../model/Schema";
const contentRouter = express.Router();
import { authMiddleware } from "../Auth/authMiddleware";

// Remove `userId` from the Zod validation schema
const contentValidator = z.object({
  type: z.enum(["document", "tweet", "youtube", "link"]),
  link: z.string().optional(),
  title: z.string().min(1, "Title must have at least 1 character"),
  tags: z.array(z.string()).nonempty("At least one tag is required"),
});

contentRouter.post("/", authMiddleware, async (req: any, res: any) => {
  try {
    console.log("User ID from middleware:", req.userId); // Log the userId to ensure it's available

    const parseData = contentValidator.safeParse(req.body);
    if (!parseData.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parseData.error.errors,
      });
    }

    const { type, link, title, tags } = parseData.data;
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is missing",
      });
    }

    const newContent = new Content({
      type,
      link,
      title,
      tags,
      userId, // This must be passed correctly to save the content
    });

    await newContent.save();
    return res.status(200).json({
      success: true,
      message: "Content added successfully!!!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error occurred. Try again later.",
    });
  }
});

contentRouter.get("/", authMiddleware, (req: any, res: any) => {
  return res.status(200).json({
    success: true,
    message: "bhag mc",
  });
});

export { contentRouter };
