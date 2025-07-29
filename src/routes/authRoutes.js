import express from "express";
import { register, login } from "../controllers/authController.js";
import passport from 'passport';

const router = express.Router();

// Authentication routes
router.post("/register", register);
router.post("/login", login);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: true
  }),
  (req, res) => {
    // Successful authentication, redirect or respond as needed
    res.redirect('http://localhost:5173'); // or send a token/response
  }
);

export default router;
