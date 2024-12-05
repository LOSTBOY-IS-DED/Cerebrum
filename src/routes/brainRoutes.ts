import { authMiddleware } from "../Auth/authMiddleware";
import { Request, Response } from "express";
import { Content, Link, Users } from "../model/Schema";
import { random } from "../utils";

const express = require("express");
const brainRouter = express.Router();

brainRouter.post(
  "/share",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const share = req.body.share;

      if (share) {
        let existingLink = await Link.findOne({ userId: req.userId });

        if (existingLink) {
          return res.status(200).json({
            success: true,
            message: "Existing sharable link found",
            hash: existingLink.hash,
          });
        }

        const hash = random(10);
        const newLink = await Link.create({
          userId: req.userId,
          hash,
        });

        return res.status(201).json({
          success: true,
          message: "New sharable link created",
          hash: newLink.hash,
        });
      } else {
        await Link.deleteOne({ userId: req.userId });

        return res.status(200).json({
          success: true,
          message: "Sharable link removed",
        });
      }
    } catch (error) {
      console.error("Error handling /share request:", error);
      return res.status(500).json({
        success: false,
        message: "An internal server error occurred",
      });
    }
  }
);

brainRouter.get("/:shareLink", async (req: Request, res: Response) => {
  try {
    const hash = req.params.shareLink;
    const link = await Link.findOne({
      hash: hash,
    });
    if (!link) {
      return res.status(411).json({
        success: true,
        message: "Sorry incorrect input",
      });
    }

    const brainContent = await Content.find({
      userId: link.userId,
    });

    const user = await Users.findOne({
      _id: link.userId,
    });

    console.log(link);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      username: user?.username,
      content: brainContent,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred",
    });
  }
});

export { brainRouter };
