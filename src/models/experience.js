import mongoose from "mongoose";
import validator from "validator";
import schemaMessages from "../constants/schemaMessages.js";

const experienceSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
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
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Experience", experienceSchema);
