import mongoose from "mongoose";
const { Schema, model } = mongoose;
const jobSchema = new Schema(
  {
    jobTitle: {
      type: String,
      required: true,
    },
    jobLocation: {
      type: String,
      required: true,
      enum: ["onsite", "remotely", "hybrid"],
    },
    workingTime: {
      type: String,
      required: true,
      enum: ["full time", "part time"],
    },
    seniorityLevel: {
      type: String,
      required: true,
      enum: ["Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"],
    },
    jobDescription: {
      type: String,
      required: true,
    },
    technicalSkills: [String],
    softSkills: [String],
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Job || model("Job", jobSchema)