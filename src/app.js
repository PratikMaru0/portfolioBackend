import express from "express";
import "./config/database.js";
import connectDB from "./config/database.js";
import messages from "./constants/statusMessages.js";
import { ManagementClient } from "auth0";
import dotenv from "dotenv";
import UserDetails from "./models/user.js";
import AllowedUsers from "./models/allowedUsers.js";

dotenv.config();
const app = express();
app.use(express.json());

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

//^ This API will return all users present on platform.
app.get("/users", async (req, res) => {
  try {
    const management = new ManagementClient({
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      domain: process.env.AUTH0_DOMAIN,
    });
    const users = await management.users.getAll();
    res.send(users);
  } catch (err) {
    res.status(400).send({
      message: messages.FAILED_USERS_FETCH_AUTH0,
      error: err.message,
    });
  }
});

//todo Accounts APIs
app.post("/addUser", async (req, res) => {
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

app.get("/getAllowedUsers", async (req, res) => {
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
