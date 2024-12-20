require("dotenv").config();

const express = require("express");
const z = require("zod");
import { Content } from "../model/Schema";
const contentRouter = express.Router();
import { authMiddleware } from "../Auth/authMiddleware";

const contentValidator = z.object({
  link: z.string().optional(),
  type: z.enum(["document", "tweet", "youtube", "link"]),
  title: z.string().min(1, "Title must have at least 1 character"),
  // tags: z.array(z.string()).optional(),
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

    const { type, link, title } = parseData.data;
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
      tags: [],
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

    // Fetch contents and populate userId
    const contents = await Content.find({ userId }, { __v: 0 }).populate(
      "userId",
      "username _id" // Select only the username and _id from Users
    );

    // Transform the data
    const transformedContent = contents.map((content: any, index: number) => ({
      id: index + 1,
      type: content.type,
      link: content.link,
      title: content.title,
      tags: content.tags,
      userId: content.userId, // Contains both _id and username
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
