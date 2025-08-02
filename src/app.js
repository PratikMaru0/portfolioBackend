import express from "express";
import "./config/database.js";
import connectDB from "./config/database.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.js";
import profileRouter from "./routes/profile.js";
import administrationRouter from "./routes/administration.js";
import experienceRouter from "./routes/experiences.js";
import educationRouter from "./routes/education.js";
import projectRouter from "./routes/projects.js";
import serviceRouter from "./routes/services.js";
import aboutRouter from "./routes/aboutMe.js";
import cors from "cors";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FE_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", administrationRouter);
app.use("/", experienceRouter);
app.use("/", educationRouter);
app.use("/", projectRouter);
app.use("/", serviceRouter);
app.use("/", aboutRouter);

app.get("/", (req, res) => {
  res.status(200).send("Hello from backend");
});

// Testing
export default app;
