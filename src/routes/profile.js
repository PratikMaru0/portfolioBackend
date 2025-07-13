import express from "express";
import UserDetails from "../models/user.js";
import messages from "../constants/statusMessages.js";
import { validateEditProfileData } from "../utils/validation.js";
import validator from "validator";
import { isAdmin } from "../middlewares.js";
import schemaMessages from "../constants/schemaMessages.js";
import bcrypt from "bcrypt";

const router = express.Router();

// ^ This API will update user details
//todo This API afterwards not required.
router.post("/profile", isAdmin, async (req, res) => {
  try {
    const count = await UserDetails.countDocuments();
    if (count >= 1) {
      return res.status(400).json({ message: "Only one profile allowed." });
    }
    const userDetails = new UserDetails(req.body);
    await userDetails.save();
    res.json({
      message: messages.CREATE_SUCCESS,
      data: userDetails,
    });
  } catch (err) {
    res.status(400).json({
      message: messages.CREATE_FAILED,
      error: err.message,
    });
  }
});

// ^ This API will return user basic details
router.get("/profile", async (req, res) => {
  try {
    const details = await UserDetails.findOne();
    res.json({
      message: messages.FETCH_SUCCESS,
      data: details,
    });
  } catch (err) {
    res.status(400).json({
      message: messages.FETCH_FAILED,
      error: err.message,
    });
  }
});

// ^ API :- Used to update profile details
router.patch("/profile", isAdmin, async (req, res) => {
  try {
    // Separate the socialMediaLinks from other fields
    const { socialMediaLink, ...otherFields } = req.body;

    if (!validator.isURL(socialMediaLink)) {
      throw new Error(messages.INVALID_URL);
    }

    // Validate fields (update your validation to allow 'socialMediaLink')
    if (!validateEditProfileData(req)) {
      throw new Error(messages.INVALID_EDIT_REQUEST);
    }

    // Build update object
    let updateObj = {};
    if (Object.keys(otherFields).length > 0) {
      updateObj.$set = otherFields;
    }
    if (socialMediaLink) {
      updateObj.$push = { socialMediaLinks: socialMediaLink };
    }

    const updatedProfile = await UserDetails.findOneAndUpdate({}, updateObj, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: `${updatedProfile.firstName}'s, ${messages.PROFILE_UPDATE_SUCCESS}`,
      data: updatedProfile,
    });
  } catch (err) {
    res
      .status(400)
      .json({ message: messages.UPDATE_FAILED, error: err.message });
  }
});

// ^ API :- Used to update password of the Admin
router.patch("/updatePassword", isAdmin, async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      throw new Error(messages.ALL_PASSWORD_FIELDS_REQUIRED);
    }

    if (!validator.isStrongPassword(newPassword)) {
      throw new Error(schemaMessages.PASSWORD_INVALID);
    }
    if (newPassword !== confirmNewPassword) {
      throw new Error(messages.NEW_PASSWORD_MISMATCH);
    }
    const adminDetails = req.admin;

    const isPasswordValid = await bcrypt.compare(
      oldPassword,
      adminDetails.password
    );
    if (!isPasswordValid) {
      throw new Error(messages.OLD_PASSWORD_NOT_VALID);
    }
    if (oldPassword === newPassword) {
      throw new Error(messages.OLD_NEW_PASSWORD_MATCH);
    }
    adminDetails.password = await bcrypt.hash(newPassword, 10);
    await adminDetails.save();
    res.json({ message: messages.PASSWORD_UPDATE_SUCCESS });
  } catch (err) {
    res.status(400).json({
      message: messages.UPDATE_FAILED,
      error: err.message,
    });
  }
});

export default router;
