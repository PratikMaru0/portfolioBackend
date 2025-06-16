import mongoose from "mongoose";
import validator from "validator";
import schemaMessages from "../constants/schemaMessages.js";

const educationSchema = new mongoose.Schema(
  {
    institute: {
      type: String,
      required: true,
      trim: true,
      index: true,
      unique: true,
    },
    degree: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    startDate: {
      type: Date,
      required: true,
      validate(value) {
        if (!validator.isDate(value)) {
          throw new Error(schemaMessages.INVALID_DATE);
        }
      },
    },
    endDate: {
      type: Date,
      validate(value) {
        if (value !== null || !validator.isDate(value.toString())) {
          throw new Error(schemaMessages.INVALID_DATE);
        }
      },
    },
    learnings: {
      type: String,
      required: true,
      maxLength: 250,
      validate(value) {
        if (value.length > 250) {
          throw new Error(schemaMessages.MAX_LEN_250);
        }
      },
    },
    activities: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Education", educationSchema);
