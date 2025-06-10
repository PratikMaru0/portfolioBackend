import express from "express";
import "./config/database.js";
import connectDB from "./config/database.js";
import messages from "./constants/statusMessages.js";
import dotenv from "dotenv";
import UserDetails from "./models/user.js";
import AllowedUsers from "./models/allowedUsers.js";
import Admin from "./models/admin.js";
import { validateSignUpData } from "./utils/validation.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { isAdmin, isAllowed } from "./middlewares.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

// ^ API :- Used to update profile details
app.patch("/profile", async (req, res) => {
  try {
    const result = await UserDetails.updateOne(
      {},
      { $set: req.body },
      { runValidators: true }
    );
    console.log(result.modifiedCount);
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
app.post("/profile", async (req, res) => {
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
app.get("/profile", async (req, res) => {
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

// ^ Admin can add user to Admin List (So that user can sign up as an Admin)
app.post("/addUser", isAdmin, async (req, res) => {
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
app.get("/getAllowedUsers", isAdmin, async (req, res) => {
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

// ^ Get Admin detaisls
app.get("/adminDetails", isAdmin, async (req, res) => {
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

// ^ Admin Sign Up
app.post("/signUp", isAllowed, async (req, res) => {
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
app.post("/login", isAllowed, async (req, res) => {
  try {
    if (req.allowed) {
      const { emailId, password } = req.body;

      const admin = await Admin.findOne({ emailId });
      if (!admin) {
        throw new Error(messages.LOGIN_FAILED);
      }
      const isPasswordValid = await bcrypt.compare(password, admin.password);

      if (isPasswordValid) {
        const token = await jwt.sign(
          { _id: admin.emailId },
          process.env.SECRET_KEY
        );
        res.cookie("token", token);
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

//! Database connection
connectDB()
  .then(() => {
    console.log("Data connection established");
    app.listen(process.env.PORT, () => {
      console.log("Listening on Port " + process.env.PORT);
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
