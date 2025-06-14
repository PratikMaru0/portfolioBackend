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
    res.send(experiences);
  } catch (err) {
    res.status(400).send({
      message: messages.FETCH_FAILED,
      error: err.message,
    });
  }
});

// ^ Admin :- Used to create new experience record
router.post("/experience", isAdmin, (req, res) => {
  res.send("Experience");
});

// ^ Admin :- Used to update new experience record
router.patch("/experience/:id", isAdmin, (req, res) => {
  try {
    const { id } = req.params;
    if (!validateExperienceData(req)) {
      throw new Error(messages.INVALID_EDIT_REQUEST);
    }

    res.send(messages.UPDATE_SUCCESS);
  } catch (err) {
    res.status(400).send({
      message: messages.UPDATE_FAILED,
      error: err.message,
    });
  }
});

// ^ Admin :- Used to delete existing experience record
router.delete("/experience/:id", isAdmin, (req, res) => {
  res.send("Experience");
});

export default router;
