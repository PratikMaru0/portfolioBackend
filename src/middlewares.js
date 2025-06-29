import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import messages from "./constants/statusMessages.js";
import Admin from "./models/admin.js";
import AllowedUsers from "./models/allowedUsers.js";

dotenv.config();

// ^ Admin validation
const isAdmin = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new Error(messages.INVALID_TOKEN);
    }
    const { _id } = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const admin = await Admin.findOne({
      emailId: _id,
    });

    if (!admin) {
      throw new Error(messages.ADMIN_NOT_FOUND);
    }
    req.admin = admin;
    next();
  } catch (err) {
    res
      .status(400)
      .send({ message: messages.LOGIN_FAILED, error: err.message });
  }
};

// ^ Is allowed to create an account. (Should be approved by Admin only).
const isAllowed = async (req, res, next) => {
  try {
    const { emailId } = req.body;
    const allowedUser = await AllowedUsers.findOne({ emailId: emailId });
    if (!allowedUser) {
      req.allowed = false;
    } else {
      req.allowed = true;
    }
    next();
  } catch (err) {
    res.status(400).send({
      message: messages.FETCH_FAILED,
      error: err.message,
    });
  }
};

const isVerifiedAdmin = async (req, res, next) => {
  try {
    const { emailId } = req.body;
    const admin = await Admin.findOne({ emailId: emailId });
    if (!admin) {
      req.allowed = false;
    } else {
      req.allowed = true;
    }
    next();
  } catch (err) {
    res.status(400).send({
      message: messages.FETCH_FAILED,
      error: err.message,
    });
  }
};

export { isAdmin, isAllowed, isVerifiedAdmin };
