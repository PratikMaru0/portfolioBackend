import express from "express";
import { isAdmin, isAllowed, isVerifiedAdmin } from "../middlewares.js";
import bcrypt from "bcrypt";
import Admin from "../models/admin.js";
import { validateSignUpData } from "../utils/validation.js";
import messages from "../constants/statusMessages.js";
import schemaMessages from "../constants/schemaMessages.js";
import sendEmail from "../config/email.js";
import jwt from "jsonwebtoken";
import validator from "validator";
import { sendOTPEmail } from "../config/email.js";
import AllowedUsers from "../models/allowedUsers.js";
import getImageKitInstance from "../utils/imageKit.js";

const router = express.Router();

// ^ Admin Sign Up
router.post("/signUp", isAllowed, async (req, res) => {
  try {
    const admin = await Admin.findOne({ emailId: req.body.emailId });
    if (admin) {
      throw new Error(messages.ADMIN_ALREADY_EXISTS);
    }
    if (req.allowed) {
      validateSignUpData(req);
      const { emailId, password } = req.body;

      const passwordHash = await bcrypt.hash(password, 10);
      const admin = await new Admin({
        emailId,
        password: passwordHash,
      });
      await admin.save();
      await AllowedUsers.deleteOne({ emailId });

      res.status(200).json({
        message: messages.SIGNUP_SUCCESSFULL,
      });
    } else {
      throw new Error(messages.NON_ADMIN);
    }
  } catch (err) {
    res.status(400).json({
      message: messages.CREATE_FAILED,
      error: err.message,
    });
  }
});

// ^ Admin Log in
router.post("/login", isVerifiedAdmin, async (req, res) => {
  try {
    if (!req.allowed) {
      const { emailId } = req.body;
      const invitedAdmin = await AllowedUsers.findOne({ emailId });
      if (!invitedAdmin) {
        throw new Error(messages.NON_ADMIN);
      } else {
        throw new Error(messages.NO_ACCOUNT_FOUND);
      }
    } else {
      const { emailId, password } = req.body;
      const admin = await Admin.findOne({ emailId });

      if (admin.isVerified === false) {
        const error = new Error(messages.ADMIN_NOT_VERIFIED);
        error.status = 403;
        throw error;
      }
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
          .status(200)
          .json({
            message: messages.LOGIN_SUCCESS,
            admin: {
              _id: admin._id,
              emailId: admin.emailId,
              isVerified: admin.isVerified,
            },
          });
      } else {
        throw new Error(messages.LOGIN_FAILED);
      }
    }
  } catch (err) {
    res
      .status(err.status || 400)
      .json({ message: messages.SOMETHING_WENT_WRONG, error: err.message });
  }
});

// ^ Admin Log out
router.post("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.status(200).json({
    message: messages.LOGOUT_SUCCESSFULL,
  });
});

// ^ Admin Forgot password
router.post("/forgotPassword", async (req, res) => {
  try {
    const { emailId } = req.body;

    const token = await jwt.sign({ _id: emailId }, process.env.JWT_SECRET_KEY, {
      expiresIn: "15m",
    });
    const link = `${process.env.FE_URL}/resetPassword/${token}`;
    const isEmailSent = await sendEmail(emailId, link);
    if (isEmailSent) {
      res.status(200).json({ message: messages.EMAIL_SENT_SUCCESS });
    }
  } catch (err) {
    res.status(400).json({
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
    res.status(200).json({
      message: messages.PASSWORD_UPDATE_SUCCESS,
      admin: {
        _id: admin._id,
        emailId: admin.emailId,
        isVerified: admin.isVerified,
      },
    });
  } catch (err) {
    res.status(400).send({
      message: messages.SOMETHING_WENT_WRONG,
      error: err.message,
    });
  }
});

// ^ Admin verify account
router.post("/sendVerificationCode", async (req, res) => {
  try {
    const { emailId } = req.body;
    const admin = await Admin.findOne({ emailId });

    if (!admin) {
      throw new Error(messages.ADMIN_NOT_FOUND);
    }
    if (admin.isVerified) {
      throw new Error(messages.ADMIN_ALREADY_VERIFIED);
    }

    const generateOTP = () =>
      Math.floor(100000 + Math.random() * 900000).toString();
    const otp = generateOTP();

    const token = jwt.sign(
      { _id: emailId, _otp: otp },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "15m",
      }
    );

    res.cookie("token", token, {
      expires: new Date(Date.now() + 15 * 60 * 1000), //& Cookie will expire in 15 minutes
    });

    const isEmailSent = await sendOTPEmail(emailId, otp);

    if (!isEmailSent) {
      throw new Error(messages.SOMETHING_WENT_WRONG);
    }
    res.status(200).json({
      message: messages.OTP_SENT_SUCCESS,
    });
  } catch (err) {
    res.status(400).json({
      message: messages.SOMETHING_WENT_WRONG,
      error: err.message,
    });
  }
});

router.post("/verifyOTP", async (req, res) => {
  try {
    const { otp } = req.body;
    const { _id, _otp } = await jwt.verify(
      req.cookies.token,
      process.env.JWT_SECRET_KEY
    );
    const admin = await Admin.findOne({ emailId: _id });
    if (!admin) {
      throw new Error(messages.ADMIN_NOT_FOUND);
    }
    if (admin.isVerified) {
      throw new Error(messages.ADMIN_ALREADY_VERIFIED);
    }
    if (_otp !== otp) {
      throw new Error(messages.INVALID_OTP);
    }
    if (_otp === otp) {
      admin.isVerified = true;
      await admin.save();
      res.status(200).json({
        message: messages.ADMIN_VERIFICATION_SUCCESS,
        admin: {
          emailId: admin.emailId,
          createdAt: admin.createdAt,
          updatedAt: admin.updatedAt,
        },
      });
    }
  } catch (err) {
    res.status(400).json({
      message: messages.SOMETHING_WENT_WRONG,
      error: err.message,
    });
  }
});

router.get("/imageKitAuth", (req, res) => {
  try {
    const imagekit = getImageKitInstance();
    const { token, expire, signature } = imagekit.getAuthenticationParameters();
    console.log(token, expire, signature);

    res.send({
      token,
      expire,
      signature,
      publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    });
  } catch (err) {
    res.status(400).json({
      message: messages.IMAGE_KIT_AUTH_FAIL,
      error: err.message,
    });
  }
});

router.delete("/delete/:fileId", async (req, res) => {
  const imagekit = getImageKitInstance();
  try {
    const result = await imagekit.deleteFile(req.params.fileId);
    res.status(200).json({ success: true, result });
  } catch (err) {
    res
      .status(500)
      .json({ message: messages.IMAGE_KIT_DELETE_FAIL, error: err.message });
  }
});

export default router;
