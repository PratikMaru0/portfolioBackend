import express from "express";
import AllowedUsers from "../models/allowedUsers.js";
import messages from "../constants/statusMessages.js";
import { isAdmin } from "../middlewares.js";

const router = express.Router();

// ^ Admin can add user to Admin List (So that user can sign up as an Admin)
router.post("/addUser", isAdmin, async (req, res) => {
  try {
    const { emailId } = req.body;
    const allowedUsers = await new AllowedUsers({ emailId });
    await allowedUsers.save();
    res.status(200).send(messages.CREATE_SUCCESS);
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
    res.status(200).send(allowedUsers);
  } catch (err) {
    res.status(400).send({
      message: messages.FETCH_FAILED,
      error: err.message,
    });
  }
});

// ^ Get Admin details
router.get("/adminDetails", isAdmin, async (req, res) => {
  try {
    const { emailId, createdAt, updatedAt } = req.admin;
    res.status(200).send({ emailId, createdAt, updatedAt });
  } catch (err) {
    res.status(400).send({
      message: messages.FETCH_FAILED,
      error: err.message,
    });
  }
});

export default router;
