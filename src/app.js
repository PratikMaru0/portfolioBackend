import express from "express";
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

// Middleware to ensure DB connection is established before handling any request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("DB connection error:", err);
    res.status(500).json({ message: "Database connection error", error: err.message });
  }
});

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", administrationRouter);
app.use("/", experienceRouter);
app.use("/", educationRouter);
app.use("/", projectRouter);
app.use("/", serviceRouter);
app.use("/", aboutRouter);

app.listen(process.env.PORT, () => {
  console.log("Listening on Port " + process.env.PORT);
});

export default app;
