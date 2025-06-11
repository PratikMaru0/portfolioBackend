import express from "express";
import UserDetails from "../models/user.js";
import messages from "../constants/statusMessages.js";

const router = express.Router();

// ^ API :- Used to update profile details
router.patch("/profile", async (req, res) => {
  try {
    const result = await UserDetails.updateOne(
      {},
      { $set: req.body },
      { runValidators: true }
    );
    if (result.modifiedCount > 0) {
      res.send(messages.UPDATE_SUCCESS);
    } else {
      throw new Error(messages.RECORD_NOT_FOUND);
    }
  } catch (err) {
    res
      .status(400)
      .send({ message: messages.UPDATE_FAILED, error: err.message });
  }
});

// ^ This API will update user details
//todo This API afterwards not required.
router.post("/profile", async (req, res) => {
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

export default router;
