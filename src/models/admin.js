import mongoose from "mongoose";
import validator from "validator";
import messages from "../constants/schemaMessages.js";

const admin = new mongoose.Schema(
  {
    emailId: {
      type: String,
      lowercase: true,
      maxLength: 100,
      trim: true,
      unique: [true, messages.EMAIL_UNIQUE],
      required: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error(messages.EMAIL_INVALID);
        }
      },
    },
    password: {
      type: String,
      minLength: 8,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(messages.PASSWORD_INVALID);
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Admin", admin);
