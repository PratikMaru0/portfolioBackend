import mongoose from "mongoose";
import validator from "validator";
import schemaMessages from "../constants/schemaMessages.js";

const aboutSchema = new mongoose.Schema({
  introduction: {
    type: String,
    required: true,
    trim: true,
    maxLength: 500,
  },
  skills: [
    {
      skill: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50,
      },
      icon: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
          if (!validator.isURL(value)) {
            throw new Error(schemaMessages.URL_INVALID);
          }
        },
      },
      iconFileId: {
        type: String,
        required: true,
      },
    },
  ],
});

export default mongoose.model("About", aboutSchema);
