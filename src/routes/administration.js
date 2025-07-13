import express from "express";
import AllowedUsers from "../models/allowedUsers.js";
import messages from "../constants/statusMessages.js";
import { isAdmin } from "../middlewares.js";
import Admin from "../models/admin.js";

const router = express.Router();

// ^ Admin can add user to Admin List (So that user can sign up as an Admin)
router.post("/addUser", isAdmin, async (req, res) => {
  try {
    const { emailId } = req.body;
    const isAdmin = await Admin.findOne({ emailId });
    if (isAdmin) {
      throw new Error(messages.ADMIN_ALREADY_EXISTS);
    }
    const allowedUsers = await new AllowedUsers({ emailId });
    await allowedUsers.save();
    res.status(200).json({
      message: messages.CREATE_SUCCESS,
      data: allowedUsers,
    });
  } catch (err) {
    res.status(400).send({
      message: messages.CREATE_FAILED,
      error: err.message,
    });
  }
});

// ^ Users allowed to be Admin
router.get("/getAllowedUsers", isAdmin, async (req, res) => {
  try {
    const allowedUsers = await AllowedUsers.find({});
    res.status(200).json({
      message: messages.FETCH_SUCCESS,
      data: allowedUsers,
    });
  } catch (err) {
    res.status(400).json({
      message: messages.FETCH_FAILED,
      error: err.message,
    });
  }
});

// ^ Get Admin details
router.get("/adminDetails", isAdmin, async (req, res) => {
  try {
    const { emailId, createdAt, updatedAt } = req.admin;
    res.status(200).json({
      message: messages.FETCH_SUCCESS,
      data: { emailId, createdAt, updatedAt },
    });
  } catch (err) {
    res.status(400).json({
      message: messages.FETCH_FAILED,
      error: err.message,
    });
  }
});

// ^ Get all current admins
router.get("/getAdmins", isAdmin, async (req, res) => {
  try {
    const admins = await Admin.find({}).select("emailId createdAt updatedAt");
    res.status(200).json({
      message: messages.FETCH_SUCCESS,
      data: admins,
    });
  } catch (err) {
    res.status(400).json({
      message: messages.FETCH_FAILED,
      error: err.message,
    });
  }
});

// ^ Remove admins / invited admins
router.delete("/removeUser", isAdmin, async (req, res) => {
  try {
    const { emailId } = req.body;
    if (!emailId) throw new Error(messages.INVALID_DELETE_REQUEST);
    if (emailId === req.admin.emailId)
      throw new Error(messages.SELF_ADMIN_DELETE);

    const admin = await Admin.findOne({ emailId });

    if (!admin) {
      const invitedAdmin = await AllowedUsers.findOne({ emailId });
      if (!invitedAdmin) throw new Error(messages.ADMIN_NOT_FOUND);
      await AllowedUsers.deleteOne({ emailId });
      res.status(200).json({
        message: messages.DELETE_SUCCESS,
      });
      return;
    }

    await Admin.deleteOne({ emailId });
    res.status(200).json({
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
