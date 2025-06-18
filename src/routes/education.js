import express from "express";
import Education from "../models/education.js";
import { validateEducationData } from "../utils/validation.js";
import messages from "../constants/statusMessages.js";
import { isAdmin } from "../middlewares.js";
const router = express.Router();

router.get("/education", async (req, res) => {
  try {
    const educationDetails = await Education.find({});
    res.status(200).json(educationDetails);
  } catch (err) {
    res.status(400).json({
      message: messages.FETCH_FAILED,
      error: err.message,
    });
  }
});

router.post("/education", isAdmin, async (req, res) => {
  try {
    if (!validateEducationData(req)) {
      throw new Error(messages.INVALID_EDIT_REQUEST);
    }
    const educationDetails = new Education(req.body);
    await educationDetails.save();
    res.json({
      message: messages.CREATE_SUCCESS,
      data: educationDetails,
    });
  } catch (err) {
    res.status(400).json({
      message: messages.CREATE_FAILED,
      error: err.message,
    });
  }
});

router.patch("/education/:id", isAdmin, async (req, res) => {
  try {
    if (!validateEducationData(req)) {
      throw new Error(messages.INVALID_EDIT_REQUEST);
    }
    const { id } = req.params;
    const educationDetails = await Education.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!educationDetails) {
      return res.status(404).json({ message: "Education record not found." });
    }
    res.json({
      message: messages.UPDATE_SUCCESS,
      data: educationDetails,
    });
  } catch (err) {
    res.status(400).json({
      message: messages.UPDATE_FAILED,
      error: err.message,
    });
  }
});

router.delete("/education/:id", isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await Education.findByIdAndDelete(id);
    res.json({
      message: messages.DELETE_SUCCESS,
    });
  } catch (err) {
    res.status(400).json({
      message: messages.DELETE_FAILED,
      error: err.message,
    });
  }
});

export default router;
