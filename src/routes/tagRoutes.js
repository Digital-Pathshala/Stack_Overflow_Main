import express from "express";
import Question from "../models/Question.js";

const tagRouter = express.Router();

// GET /api/tags → list all tags with counts
tagRouter.get("/", async (req, res) => {
  try {
    const tagsData = await Question.aggregate([
      { $unwind: "$tags" }, // Split tags array
      {
        $group: {
          _id: "$tags",
          questionCount: { $sum: 1 },
          recentCount: {
            $sum: {
              $cond: [
                {
                  $gte: [
                    "$createdAt",
                    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $project: {
          name: "$_id",
          questionCount: 1,
          recentCount: 1,
          description: { $literal: "Questions related to this tag" },
        },
      },
      { $sort: { questionCount: -1 } },
    ]);

    res.json(tagsData);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/tags/:tagName → get questions for a specific tag
tagRouter.get("/:tagName", async (req, res) => {
  try {
    const { tagName } = req.params;
    const questions = await Question.find({ tags: tagName }).sort({
      createdAt: -1,
    });
    res.json({ success: true, data: questions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default tagRouter;
