import mongoose from "mongoose";

const servicesSchema = new mongoose.Schema({
  service: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxLength: 500,
  },
});

export default mongoose.model("ServicesDetails", servicesSchema);
