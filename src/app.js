import express from "express";
import "./config/database.js";
import connectDB from "./config/database.js";
import messages from "./statusMessages.js";
import { ManagementClient } from "auth0";
import dotenv from "dotenv";
import UserDetails from "./models/user.js";

dotenv.config();
const app = express();
app.use(express.json());

app.get("/userDetails", (req, res) => {});

// ^ API :- Used to update profile details
app.patch("/profile", async (req, res) => {
  try {
    await UserDetails.updateOne(
      {},
      { $set: req.body },
      { runValidators: true }
    );
    res.send(messages.UPDATE_SUCCESS);
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
    const userDetails = new UserDetails(req.body);
    await userDetails.save();
    res.send("User created successfully");
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

//! Database connection
connectDB()
  .then(() => {
    console.log("Data connection established");
    app.listen(3000, () => {
      console.log("Listening on Port 3000");
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
