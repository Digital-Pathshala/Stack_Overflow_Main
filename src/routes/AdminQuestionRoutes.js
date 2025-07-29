import express from 'express';
import {
  getAllQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion
} from '../controllers/AdminquestionController.js';
import { authenticateAdmin } from '../middleware/authMiddleWare.js';

const router = express.Router();

// Apply admin authentication middleware to all routes
router.use(authenticateAdmin);

router.get('/', getAllQuestions);
router.post('/', createQuestion);
router.put('/:id', updateQuestion);
router.delete('/:id', deleteQuestion);

export default router;