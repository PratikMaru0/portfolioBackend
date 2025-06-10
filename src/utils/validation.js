import validator from "validator";
import schemaMessages from "../constants/schemaMessages.js";

export const validateSignUpData = (req) => {
  const { emailId, password } = req.body;

  if (!validator.isEmail(emailId)) {
    throw new Error(schemaMessages.EMAIL_INVALID);
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error(schemaMessages.PASSWORD_INVALID);
  }
};
