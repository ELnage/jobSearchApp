import mongoose from "mongoose";

const { Schema, model } = mongoose;

const companySchema = new Schema(
  {
    companyName: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    industry: String,
    address: String,
    numberOfEmployees: {
      type: Number,
      min: 11,
      max: 20,
    },
    companyEmail: {
      type: String,
      required: true,
      unique: true,
    },
    companyHR: {
      type : Schema.Types.ObjectId,
      ref: "User",
      required : true
    }
  },
  {
    timestamps: true,
  }
);
export default mongoose.models.Company ||  model("Company", companySchema);

