import express from "express";
import { isAllowed } from "../middlewares.js";
import bcrypt from "bcrypt";
import Admin from "../models/admin.js";
import { validateSignUpData } from "../utils/validation.js";
import messages from "../constants/statusMessages.js";
import schemaMessages from "../constants/schemaMessages.js";
import sendEmail from "../config/email.js";
import jwt from "jsonwebtoken";
import common from "../constants/common.js";
import validator from "validator";

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
        res
          .cookie("token", token, {
            expires: new Date(Date.now() + 7 * 24 * 3600000), //& Cookie will expire in 7 days
          })
          .send(messages.LOGIN_SUCCESS);
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

// ^ Admin Log out
router.post("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.status(200).send(messages.LOGOUT_SUCCESSFULL);
});

// ^ Admin Forgot password
router.post("/forgotPassword", async (req, res) => {
  try {
    const { emailId } = req.body;

    const token = await jwt.sign({ _id: emailId }, process.env.JWT_SECRET_KEY, {
      expiresIn: "15m",
    });
    const link = `${common.backendUrl}resetPassword/${token}`;
    const isEmailSent = await sendEmail(emailId, link);
    if (isEmailSent) {
      res.status(200).send("Email sent succssfully");
    }
  } catch (err) {
    res.send({
      message: messages.SOMETHING_WENT_WRONG,
      error: err.message,
    });
  }
});

// ^ Admin reset password
router.post("/resetPassword/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { _id } = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { password } = req.body;
    if (!validator.isStrongPassword(password)) {
      throw new Error(schemaMessages.PASSWORD_INVALID);
    }
    const encryptedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.findOne({ emailId: _id });
    if (!admin) {
      throw new Error("Email is not registered with us");
    }
    admin.password = encryptedPassword;
    await admin.save();
    res.send(messages.PASSWORD_UPDATE_SUCCESS);
  } catch (err) {
    res.status(400).send({
      message: messages.SOMETHING_WENT_WRONG,
      error: err.message,
    });
  }
});

export default router;
