import express from "express";
import "./config/database.js";
import connectDB from "./config/database.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.js";
import profileRouter from "./routes/profile.js";
import administrationRouter from "./routes/administration.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", administrationRouter);

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
