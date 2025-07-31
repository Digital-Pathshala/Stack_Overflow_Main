import express from "express";
import {
  getAdminProfile,
  updateAdminProfile,
} from "../controllers/adminControllers.js";
import Question from "../models/Question.js";

const router = express.Router();

router.get("/profile", getAdminProfile);
router.put("/profile", updateAdminProfile);

// Admin Questions endpoints
router.get("/questions", async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: questions,
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching questions",
    });
  }
});

router.put("/questions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const updatedQuestion = await Question.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedQuestion) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    res.json({
      success: true,
      message: "Question updated successfully",
      data: updatedQuestion,
    });
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({
      success: false,
      message: "Error updating question",
    });
  }
});

router.post("/questions", async (req, res) => {
  try {
    const questionData = req.body;
    const newQuestion = new Question(questionData);
    await newQuestion.save();

    res.status(201).json({
      success: true,
      message: "Question created successfully",
      data: newQuestion,
    });
  } catch (error) {
    console.error("Error creating question:", error);
    res.status(500).json({
      success: false,
      message: "Error creating question",
    });
  }
});

router.delete("/questions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedQuestion = await Question.findByIdAndDelete(id);

    if (!deletedQuestion) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    res.json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting question",
    });
  }
});

export default router;

