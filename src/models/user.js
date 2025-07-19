import mongoose from "mongoose";
import validator from "validator";
import messages from "../constants/schemaMessages.js";

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
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error(messages.EMAIL_INVALID);
        }
      },
    },
    phoneNumber: {
      type: String,
      required: true,
      maxLength: 20,
    },
    profilePicUrl: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error(messages.URL_INVALID);
        }
      },
    },
    profilePicFileId: {
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
      validate(links) {
        if (links.length > 10) {
          throw new Error(messages.SOCIAL_MEDIA_LINKS_LIMIT);
        }
        for (const link of links) {
          if (!validator.isURL(link)) {
            throw new Error(messages.URL_INVALID);
          }
        }
      },
    },
    resumeUrl: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error(messages.URL_INVALID);
        }
      },
    },
    resumeFileId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("UserDetails", userDetailsSchema);
