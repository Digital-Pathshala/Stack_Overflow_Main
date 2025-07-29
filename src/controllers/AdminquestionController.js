import Question from '../models/Question.js';

// Get all questions
export const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
      .populate('author', 'fullName email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: questions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching questions'
    });
  }
};

// Create new question
export const createQuestion = async (req, res) => {
  try {
    console.log('Creating question, request body:', req.body);
    
    const { title, content, tags } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }

    // Create new question
    const question = new Question({
      title,
      content,
      tags: tags || [],
      author: req.user._id, // Use the authenticated user's ID
      status: 'open'
    });

    await question.save();
    
    // Populate author details
    await question.populate('author', 'fullName email');

    res.status(201).json({
      success: true,
      data: question,
      message: 'Question created successfully'
    });

  } catch (error) {
    console.error('Error creating question:', error);
    if (error.errors) {
      // Print detailed validation errors
      Object.keys(error.errors).forEach(key => {
        console.error(`Validation error for ${key}:`, error.errors[key].message);
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error creating question',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update question
export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, tags, status } = req.body;

    // Find and update the question
    const updatedQuestion = await Question.findByIdAndUpdate(
      id,
      {
        title,
        content,
        tags,
        status
      },
      { 
        new: true,  
        runValidators: true  
      }
    ).populate('author', 'fullName email');

    if (!updatedQuestion) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    res.status(200).json({
      success: true,
      data: updatedQuestion,
      message: 'Question updated successfully'
    });
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating question'
    });
  }
};

// Delete question
export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findByIdAndDelete(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Question deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting question'
    });
  }
};