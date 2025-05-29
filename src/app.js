import express from "express";
import "./config/database.js";
import connectDB from "./config/database.js";
import error from "./errorMessages.js";
import { ManagementClient } from "auth0";
import dotenv from "dotenv";
import User from "./models/user.js";
import mongoose from "mongoose";

dotenv.config();
const app = express();
app.use(express.json());

app.get("/userDetails", (req, res) => {});

// todo :- Change functionality to one user details at once.
app.post("/createUser", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();

    res.send("User created successfully");
  } catch (err) {
    res.send(err.message);
  }
});

//^ API :- Used to fetch all users of system.
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
    res.status(500).send({
      error: error.FAILED_USERS_FETCH_AUTH0,
      message: err.message,
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
