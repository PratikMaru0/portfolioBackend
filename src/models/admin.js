import mongoose from "mongoose";
import validator from "validator";
import messages from "../constants/schemaMessages.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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

admin.methods.getJWT = async function () {
  const admin = this;
  const token = await jwt.sign(
    { _id: admin.emailId },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" } //& Token will expires in 7 Days
  );
  return token;
};

admin.methods.validatePwd = async function (passwordInputByUser) {
  //& Don't use arrow fn becoz arrow fn don't have "this" keyword.
  const admin = this;
  const pwd = await bcrypt.compare(passwordInputByUser, admin.password);
  return pwd;
};
export default mongoose.model("Admin", admin);
