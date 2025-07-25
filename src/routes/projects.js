import express from "express";
import messages from "../constants/statusMessages.js";
import Project from "../models/projects.js";
import { isAdmin } from "../middlewares.js";
import { validateProjectData } from "../utils/validation.js";

const router = express.Router();

router.get("/projects", async (req, res) => {
  try {
    const projectDetails = await Project.find({});
    res.json({
      message: messages.FETCH_SUCCESS,
      data: projectDetails,
    });
  } catch (err) {
    res.status(400).json({
      message: messages.FETCH_FAILED,
      error: err.message,
    });
  }
});

router.post("/projects", isAdmin, async (req, res) => {
  try {
    if (!validateProjectData(req)) {
      throw new Error(messages.INVALID_EDIT_REQUEST);
    }

    const projectDetails = new Project(req.body);
    await projectDetails.save();
    res.json({
      message: messages.CREATE_SUCCESS,
      data: projectDetails,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: messages.CREATE_FAILED,
      error: err.message,
    });
  }
});

router.patch("/projects/:id", isAdmin, async (req, res) => {
  try {
    if (!validateProjectData(req)) {
      throw new Error(messages.INVALID_EDIT_REQUEST);
    }
    const { id } = req.params;
    const projectDetails = await Project.findByIdAndUpdate(
      id,
      {
        ...req.body,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    await projectDetails.save();
    res.json({
      message: messages.UPDATE_SUCCESS,
      data: projectDetails,
    });
  } catch (err) {
    res.status(400).json({
      message: messages.UPDATE_FAILED,
      error: err.message,
    });
  }
});

router.delete("/projects/:id", isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await Project.findByIdAndDelete(id);
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
