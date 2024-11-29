require("dotenv").config();

const express = require("express");
const z = require("zod");
import { Content } from "../model/Schema";
const contentRouter = express.Router();
import { authMiddleware } from "../Auth/authMiddleware";

const contentValidator = z.object({
  type: z.enum(["document", "tweet", "youtube", "link"]),
  link: z.string().optional(),
  title: z.string().min(1, "Title must have at least 1 character"),
  tags: z.array(z.string()).nonempty("At least one tag is required"),
});

contentRouter.post("/", authMiddleware, async (req: any, res: any) => {
  try {
    console.log("User ID from middleware:", req.userId);

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
      userId,
    });

    await newContent.save();
    return res.status(200).json({
      success: true,
      message: "Content added successfully!!!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error occurred. Try again later.",
    });
  }
});

contentRouter.get("/", authMiddleware, async (req: any, res: any) => {
  try {
    const userId = req.userId;
    const contents = await Content.find({ userId }, { __v: 0 });

    const transformedContent = contents.map((content: any, index: number) => ({
      id: index + 1,
      type: content.type,
      link: content.link,
      title: content.title,
      tags: content.tags,
    }));

    return res.status(200).json({
      success: true,
      content: transformedContent,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error occurred while fetching content",
    });
  }
});

export { contentRouter };
