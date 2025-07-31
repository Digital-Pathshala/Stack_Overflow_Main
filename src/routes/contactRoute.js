import express from "express";
import { submitContactForm } from "../controllers/contactController.js";

const router = express.Router();

// Route for submitting contact form
router.post("/submit", submitContactForm);

export default router;
