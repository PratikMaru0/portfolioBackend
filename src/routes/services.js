import express from "express";
import Services from "../models/services.js";
import messages from "../constants/statusMessages.js";
import { isAdmin } from "../middlewares.js";

const router = express.Router();

router.get("/services", async (req, res) => {
  try {
    const services = await Services.find({});
    res.json({
      message: messages.FETCH_SUCCESS,
      data: services,
    });
  } catch (err) {
    res.status(400).json({
      message: messages.FETCH_FAILED,
      error: err.message,
    });
  }
});

router.post("/services", isAdmin, (req, res) => {
  try {
    const services = new Services(req.body);
    services.save();
    res.json({
      message: messages.CREATE_SUCCESS,
      data: services,
    });
  } catch (err) {
    res.status(400).json({
      message: messages.CREATE_FAILED,
      error: err.message,
    });
  }
});

router.patch("/services/:id", isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const serviceUpdate = await Services.findByIdAndUpdate(
      id,
      { ...req.body },
      {
        new: true,
        runValidators: true,
      }
    );
    await serviceUpdate.save();
    res.json({
      message: messages.UPDATE_SUCCESS,
      data: serviceUpdate,
    });
  } catch (err) {
    res.status(400).json({
      message: messages.UPDATE_FAILED,
      error: err.message,
    });
  }
});

router.delete("/services/:id", isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await Services.findByIdAndDelete(id);
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
