import express from 'express';
import chatController from '../controllers/chatController.js';
// import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// router.use(authMiddleware);

router.get('/messages/:roomName', chatController.getChatMessages);
router.post('/messages', chatController.sendMessage);
router.put('/messages/:messageId', chatController.editMessage);
router.delete('/messages/:messageId', chatController.deleteMessage);
router.post('/messages/:messageId/reactions', chatController.addReaction);
router.get('/search', chatController.searchMessages);

export default router;