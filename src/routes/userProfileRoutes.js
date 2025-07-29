import express from "express";
import { createProfile, getAllProfile, getProfileById, updateProfileById } from "../controllers/userProfileController.js";


const router = express.Router();

router.post("/createProfile", createProfile);
router.get("/getAllProfile", getAllProfile);
router.get("/getProfileById/:id", getProfileById);
router.put("/updateProfileById/:id", updateProfileById);

export default router;