import mongoose from "mongoose";
import validator from "validator";
import schemaMessages from "../constants/schemaMessages.js";

const projectSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error(schemaMessages.URL_INVALID);
        }
      },
    },
    projectName: {
      type: String,
      required: true,
      index: true,
      maxLength: 50,
      validate(value) {
        if (value.length > 50) {
          throw new Error(schemaMessages.MAX_LEN_50);
        }
      },
    },
    description: {
      type: String,
      required: true,
      maxLength: 500,
      validate(value) {
        if (value.length > 500) {
          throw new Error(schemaMessages.MAX_LEN_500);
        }
      },
    },
    problemSolve: {
      type: String,
      required: true,
      maxLength: 250,
      validate(value) {
        if (value.length > 250) {
          throw new Error(schemaMessages.MAX_LEN_250);
        }
      },
    },
    techStack: {
      type: Array,
      required: true,
    },
    gitHubLink: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error(schemaMessages.URL_INVALID);
        }
      },
    },
    liveLink: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error(schemaMessages.URL_INVALID);
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("ProjectDetails", projectSchema);
