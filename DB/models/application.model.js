import mongoose from "mongoose";
const { Schema, model } = mongoose;

export const applicationSchema = new Schema(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userTechSkills: [String],
    userSoftSkills: [String],
    userResume: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Application || model("Application", applicationSchema)