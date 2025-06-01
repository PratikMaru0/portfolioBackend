import mongoose from "mongoose";
import validator from "validator";
import messages from "../constants/schemaMessages.js";

const allowedUsersSchema = new mongoose.Schema({
  emailId: {
    type: String,
    lowercase: true,
    required: true,
    maxLength: 100,
    trim: true,
    unique: [true, messages.EMAIL_UNIQUE],
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error(messages.EMAIL_INVALID);
      }
    },
  },
});

export default mongoose.model("AllowedUsers", allowedUsersSchema);
