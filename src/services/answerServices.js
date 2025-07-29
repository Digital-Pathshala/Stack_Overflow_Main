import Answer from "../models/Answer.js";

const createAnswer = async (data) => {
  return await Answer.create(data);
};

const getAnswersByQuestionId = async (questionId) => {
  return await Answer.find({ questionId });
};

const upvoteAnswer = async (id) => {
  return await Answer.findByIdAndUpdate(
    id,
    { $inc: { votes: 1 } },
    { new: true }
  );
};

const downvoteAnswer = async (id) => {
  return await Answer.findByIdAndUpdate(
    id,
    { $inc: { votes: -1 } },
    { new: true }
  );
};

const editAnswer = async (id, data) => {
  return await Answer.findByIdAndUpdate(id, data, { new: true });
};

const deleteAnswer = async (id) => {
  return await Answer.findByIdAndDelete(id);
};

export default {
  createAnswer,
  getAnswersByQuestionId,
  upvoteAnswer,
  downvoteAnswer,
  editAnswer,
  deleteAnswer,
};
