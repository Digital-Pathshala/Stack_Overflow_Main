import express from "express";
import {
  createAnswer,
  getAnswersByQuestionId,
  upvoteAnswer,
  downvoteAnswer,
  editAnswer,
  deleteAnswer,
} from "../controllers/answerController.js";

const router = express.Router();

// POST /api/answer/:questionId - Add an answer to a question
router.post("/:questionId", createAnswer);

// GET /api/answer/:questionId - Get all answers for a question
router.get("/:questionId", getAnswersByQuestionId);

// PATCH /api/answer/upvote/:id - Upvote an answer
router.patch("/upvote/:id", upvoteAnswer);
// PATCH /api/answer/downvote/:id - Downvote an answer
router.patch("/downvote/:id", downvoteAnswer);

// PUT /api/answer/:id - Edit an answer
router.put("/:id", editAnswer);
// DELETE /api/answer/:id - Delete an answer
router.delete("/:id", deleteAnswer);

export default router;
