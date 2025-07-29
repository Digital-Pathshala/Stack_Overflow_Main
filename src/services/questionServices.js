import Question from "../models/Question.js";
import Answer from "../models/Answer.js";

const createQuestion = async (data) => {
  return await Question.create(data);
};

const getAllQuestions = async () => {
  return await Question.find({});
};

const getQuestionsById = async (id) => {
  return await Question.findById(id);
};

const deleteQuestionsById = async (id) => {
  return await Question.findByIdAndDelete(id);
};

const upvoteQuestion = async (id) => {
  return await Question.findByIdAndUpdate(
    id,
    { $inc: { votes: 1 } },
    { new: true }
  );
};

const downvoteQuestion = async (id) => {
  return await Question.findByIdAndUpdate(
    id,
    { $inc: { votes: -1 } },
    { new: true }
  );
};

const getTrendingQuestions = async () => {
  // Trending: most upvoted and most recent
  return await Question.find({}).sort({ votes: -1, createdAt: -1 }).limit(20);
};

const getUnansweredQuestions = async () => {
  // Find all questions
  const allQuestions = await Question.find({});
  // Find all questionIds that have at least one answer
  const answeredIds = await Answer.distinct("questionId");
  // Return questions whose _id is not in answeredIds
  return allQuestions.filter(
    (q) => !answeredIds.some((id) => id.equals(q._id))
  );
};

const searchQuestions = async (query) => {
  // Search in title, description, or tags
  return await Question.find({
    $or: [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
      { tags: { $regex: query, $options: "i" } },
    ],
  });
};

export default {
  createQuestion,
  getAllQuestions,
  getQuestionsById,
  deleteQuestionsById,
  upvoteQuestion,
  downvoteQuestion,
  getTrendingQuestions,
  getUnansweredQuestions,
  searchQuestions,
};
