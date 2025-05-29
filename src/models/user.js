import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  emailId: {
    type: String,
    lowercase: true,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  profilePicUrl: {
    type: String,
    required: true,
  },
  tagline: {
    type: String,
    required: true,
  },
  shortIntro: {
    type: String,
    required: true,
  },
  socialMediaLinks: {
    type: Array,
  },
  resumeUrl: {
    type: String,
    required: true,
  },
});

export default mongoose.model("User", userSchema);
