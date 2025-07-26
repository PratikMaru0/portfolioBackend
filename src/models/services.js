import mongoose from "mongoose";

const servicesSchema = new mongoose.Schema({
  service: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
    index: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxLength: 500,
  },
  icon: {
    type: String,
    required: true,
    trim: true,
  },
  iconFileId: {
    type: String,
    required: true,
  },
});

export default mongoose.model("ServicesDetails", servicesSchema);
