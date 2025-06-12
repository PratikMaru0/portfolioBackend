import express from "express";
import UserDetails from "../models/user.js";
import messages from "../constants/statusMessages.js";
import { validateEditProfileData } from "../utils/validation.js";
import validator from "validator";
import { isAdmin } from "../middlewares.js";

const router = express.Router();

// ^ This API will update user details
//todo This API afterwards not required.
router.post("/profile", isAdmin, async (req, res) => {
  try {
    const count = await UserDetails.countDocuments();
    if (count >= 1) {
      return res.status(400).send({ message: "Only one profile allowed." });
    }
    const userDetails = new UserDetails(req.body);
    await userDetails.save();
    res.send(messages.CREATE_SUCCESS);
  } catch (err) {
    res.status(400).send({
      message: messages.CREATE_FAILED,
      error: err.message,
    });
  }
});

// ^ This API will return user basic details
router.get("/profile", async (req, res) => {
  try {
    const details = await UserDetails.findOne();
    res.send(details);
  } catch (err) {
    res.status(400).send({
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

    res.status(200).send(updatedProfile);
  } catch (err) {
    res
      .status(400)
      .send({ message: messages.UPDATE_FAILED, error: err.message });
  }
});

export default router;
