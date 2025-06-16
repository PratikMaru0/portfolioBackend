import express from "express";
import Experience from "../models/experience.js";
import messages from "../constants/statusMessages.js";
import { isAdmin } from "../middlewares.js";
import { validateExperienceData } from "../utils/validation.js";
const router = express.Router();

// ^ Used to get all work experiences
router.get("/experience", async (req, res) => {
  try {
    const experiences = await Experience.find({});
    res.json({
      message: messages.FETCH_SUCCESS,
      data: experiences,
    });
  } catch (err) {
    res.status(400).json({
      message: messages.FETCH_FAILED,
      error: err.message,
    });
  }
});

// ^ Admin :- Used to create new experience record
router.post("/experience", isAdmin, async (req, res) => {
  try {
    const addExperience = new Experience(req.body);
    await addExperience.save();
    res.json({
      message: messages.CREATE_SUCCESS,
      data: addExperience,
    });
  } catch (err) {
    res.status(400).json({
      message: messages.CREATE_FAILED,
      error: err.message,
    });
  }
});

// ^ Admin :- Used to update new experience record
router.patch("/experience/:id", isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!validateExperienceData(req)) {
      throw new Error(messages.INVALID_EDIT_REQUEST);
    }
    const experienceDetails = await Experience.findByIdAndUpdate(
      id,
      {
        ...req.body,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    await experienceDetails.save();
    res.json({
      message: messages.UPDATE_SUCCESS,
      data: experienceDetails,
    });
  } catch (err) {
    res.status(400).json({
      message: messages.UPDATE_FAILED,
      error: err.message,
    });
  }
});

// ^ Admin :- Used to delete existing experience record
router.delete("/experience/:id", isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await Experience.findByIdAndDelete(id);
    res.json({
      message: messages.DELETE_SUCCESS,
    });
  } catch (err) {
    res.status(400).json({
      message: messages.UPDATE_FAILED,
      error: err.message,
    });
  }
});

export default router;
