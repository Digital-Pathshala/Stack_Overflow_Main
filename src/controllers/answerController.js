import answerServices from "../services/answerServices.js";

const createAnswer = async (req, res) => {
  try {
    const questionId = req.params.questionId;
    const { text, author } = req.body;
    if (!text || !author) {
      return res.status(400).json({ message: "Text and author are required" });
    }
    const answer = await answerServices.createAnswer({ text, author, questionId });
    res.status(201).json({ message: "Answer created successfully", data: answer });
  } catch (error) {
    res.status(500).json({ message: "Error creating answer", error: error.message });
  }
};

const getAnswersByQuestionId = async (req, res) => {
  try {
    const questionId = req.params.questionId;
    const answers = await answerServices.getAnswersByQuestionId(questionId);
    res.status(200).json({ message: "Answers fetched successfully", data: answers });
  } catch (error) {
    res.status(500).json({ message: "Error fetching answers", error: error.message });
  }
};

const upvoteAnswer = async (req, res) => {
  try {
    const id = req.params.id;
    const updated = await answerServices.upvoteAnswer(id);
    res.status(200).json({ message: "Upvoted!", data: updated });
  } catch (error) {
    res.status(400).send("Error upvoting answer");
  }
};

const downvoteAnswer = async (req, res) => {
  try {
    const id = req.params.id;
    const updated = await answerServices.downvoteAnswer(id);
    res.status(200).json({ message: "Downvoted!", data: updated });
  } catch (error) {
    res.status(400).send("Error downvoting answer");
  }
};

const editAnswer = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const updated = await answerServices.editAnswer(id, data);
    res.status(200).json({ message: "Answer updated successfully", data: updated });
  } catch (error) {
    res.status(400).send("Error updating answer");
  }
};

const deleteAnswer = async (req, res) => {
  try {
    const id = req.params.id;
    await answerServices.deleteAnswer(id);
    res.status(200).json({ message: "Answer deleted successfully" });
  } catch (error) {
    res.status(400).send("Error deleting answer");
  }
};

export { createAnswer, getAnswersByQuestionId, upvoteAnswer, downvoteAnswer, editAnswer, deleteAnswer }; 