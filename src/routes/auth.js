import express from "express";
import { isAllowed } from "../middlewares.js";
import bcrypt from "bcrypt";
import Admin from "../models/admin.js";
import { validateSignUpData } from "../utils/validation.js";
import messages from "../constants/statusMessages.js";

const router = express.Router();

// ^ Admin Sign Up
router.post("/signUp", isAllowed, async (req, res) => {
  try {
    if (req.allowed) {
      validateSignUpData(req);
      const { emailId, password } = req.body;

      const passwordHash = await bcrypt.hash(password, 10);
      const admin = await new Admin({
        emailId,
        password: passwordHash,
      });
      await admin.save();
      res.status(200).send(messages.SIGNUP_SUCCESSFULL);
    } else {
      throw new Error(messages.NON_ADMIN);
    }
  } catch (err) {
    res.status(400).send({
      message: messages.CREATE_FAILED,
      error: err.message,
    });
  }
});

// ^ Admin Log in
router.post("/login", isAllowed, async (req, res) => {
  try {
    if (req.allowed) {
      const { emailId, password } = req.body;

      const admin = await Admin.findOne({ emailId });
      if (!admin) {
        throw new Error(messages.LOGIN_FAILED);
      }
      const isPasswordValid = await admin.validatePwd(password);

      if (isPasswordValid) {
        const token = await admin.getJWT();
        res.cookie("token", token, {
          expires: new Date(Date.now() + 7 * 24 * 3600000), //& Cookie will expire in 7 days
        });
        res.send(messages.LOGIN_SUCCESS);
      } else {
        throw new Error(messages.LOGIN_FAILED);
      }
    } else {
      throw new Error(messages.NON_ADMIN);
    }
  } catch (err) {
    res
      .status(400)
      .send({ message: messages.SOMETHING_WENT_WRONG, error: err.message });
  }
});

export default router;
