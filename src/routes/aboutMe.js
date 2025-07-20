import express from "express";
import About from "../models/about.js";
import messages from "../constants/statusMessages.js";
const router = express.Router();

router.post("/about", async (req, res) => {
  try {
    const about = new About(req.body);
    await about.save();
    res.status(201).json({ message: messages.CREATE_SUCCESS, about });
  } catch (err) {
    res
      .status(400)
      .json({ message: messages.CREATE_FAILED, error: err.message });
  }
});

router.get("/about", async (req, res) => {
  try {
    const abouts = await About.find();
    res.status(200).json({ message: messages.FETCH_SUCCESS, abouts });
  } catch (err) {
    res
      .status(500)
      .json({ message: messages.FETCH_FAILED, error: err.message });
  }
});

router.get("/about/:id", async (req, res) => {
  try {
    const about = await About.findById(req.params.id);
    if (!about)
      return res.status(404).json({ message: messages.RECORD_NOT_FOUND });
    res.status(200).json({ message: messages.FETCH_SUCCESS, about });
  } catch (err) {
    res
      .status(500)
      .json({ message: messages.FETCH_FAILED, error: err.message });
  }
});

router.put("/about/:id", async (req, res) => {
  try {
    const about = await About.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!about)
      return res.status(404).json({ message: messages.RECORD_NOT_FOUND });
    res.status(200).json({ message: messages.UPDATE_SUCCESS, about });
  } catch (err) {
    res
      .status(400)
      .json({ message: messages.UPDATE_FAILED, error: err.message });
  }
});

router.delete("/about/:aboutId/skill/:skillId", async (req, res) => {
  const { aboutId, skillId } = req.params;
  try {
    const updatedAbout = await About.findByIdAndUpdate(
      aboutId,
      {
        $pull: { skills: { _id: skillId } },
      },
      { new: true }
    );

    if (!updatedAbout) {
      return res.status(404).json({ message: "About document not found" });
    }

    res.status(200).json({
      message: messages.DELETE_SUCCESS,
      updatedAbout,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete skill",
      error: err.message,
    });
  }
});

export default router;
