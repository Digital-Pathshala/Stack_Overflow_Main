import express from "express";
import { createQuestion, deleteQuestionsById, getAllQuestions, getQuestionByid, upvoteQuestion, downvoteQuestion, getTrendingQuestions, getUnansweredQuestions, searchQuestions } from "../controllers/questionController.js";

const router = express.Router();

router.post("/createQuestion", createQuestion);
router.get("/getAllQuestions", getAllQuestions);
router.get("/", getAllQuestions); // Root route for /api/questions
router.get("/getQuestionsById/:id", getQuestionByid);
router.delete("/deleteQuestionsById/:id", deleteQuestionsById);
router.put("/upvoteQuestion/:id", upvoteQuestion);
router.put("/downvoteQuestion/:id", downvoteQuestion);
router.get("/trending", getTrendingQuestions);
router.get("/unanswered", getUnansweredQuestions);
router.get("/search", searchQuestions);

export default router;


