import express from 'express';
import roomController from '../controllers/roomController.js';
// import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// router.use(authMiddleware);

router.get('/', roomController.getAllRooms);
router.get('/:roomName', roomController.getRoomDetails);
router.post('/', roomController.createRoom);
router.post('/:roomName/join', roomController.joinRoom);
router.post('/:roomName/leave', roomController.leaveRoom);
router.get('/:roomName/users', roomController.getActiveUsers);
router.post('/:roomName/activity', roomController.updateUserActivity);

export default router;