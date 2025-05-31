import mongoose from "mongoose";

const userDetailsSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
      trim: true,
    },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      maxLength: 100,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      maxLength: 20,
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
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("UserDetails", userDetailsSchema);
