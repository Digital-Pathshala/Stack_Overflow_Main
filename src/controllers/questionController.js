import questionServices from "../services/questionServices.js";

const createQuestion = async (req, res) => {
  try {
    const question = req.body;

    if (!question) {
      return res.status(400).send("Question details are required");
    }

    if (!question.title) {
      return res.status(400).send("Question title is required");
    }
    if (!question.description) {
      return res.status(400).send("Question description is required");
    }

    const data = await questionServices.createQuestion(question);

    res.status(200).json({
      message: "Question created successfully",
      data: data,
    });
  } catch (error) {
    console.log(error.message);
    res.status(501).send("error occurred to create question");
  }
};

const getAllQuestions = async (req, res) => {
  try {
    console.log(req.query);

    const data = await questionServices.getAllQuestions(req.query);

    res.status(200).json({
      message: "All questions fetched successfully",
      data,
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).send("Error occured while fetching the questions");
  }
};

const getQuestionByid = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await questionServices.getQuestionsById(id);
    res.status(200).json({
      message: "Question fetched successfully",
      data,
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).send("Error occured while fetching the question");
  }
};

const deleteQuestionsById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await questionServices.deleteQuestionsById(id);

    res.status(200).json({
      message: "Deleted Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).send("Error occured whle deleting the question");
  }
};

const upvoteQuestion = async (req, res) => {
  try {
    const id = req.params.id;
    const updated = await questionServices.upvoteQuestion(id);
    res.status(200).json({ message: "Upvoted!", data: updated });
  } catch (error) {
    res.status(400).send("Error upvoting question");
  }
};

const downvoteQuestion = async (req, res) => {
  try {
    const id = req.params.id;
    const updated = await questionServices.downvoteQuestion(id);
    res.status(200).json({ message: "Downvoted!", data: updated });
  } catch (error) {
    res.status(400).send("Error downvoting question");
  }
};

const getTrendingQuestions = async (req, res) => {
  try {
    const data = await questionServices.getTrendingQuestions();
    res
      .status(200)
      .json({ message: "Trending questions fetched successfully", data });
  } catch (error) {
    res.status(400).send("Error fetching trending questions");
  }
};

const getUnansweredQuestions = async (req, res) => {
  try {
    const data = await questionServices.getUnansweredQuestions();
    res
      .status(200)
      .json({ message: "Unanswered questions fetched successfully", data });
  } catch (error) {
    res.status(400).send("Error fetching unanswered questions");
  }
};

const searchQuestions = async (req, res) => {
  try {
    const query = req.query.q || "";
    const data = await questionServices.searchQuestions(query);
    res
      .status(200)
      .json({ message: "Search results fetched successfully", data });
  } catch (error) {
    res.status(400).send("Error searching questions");
  }
};

export {
  createQuestion,
  getAllQuestions,
  getQuestionByid,
  deleteQuestionsById,
  upvoteQuestion,
  downvoteQuestion,
  getTrendingQuestions,
  getUnansweredQuestions,
  searchQuestions,
};
