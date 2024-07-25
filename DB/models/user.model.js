import mongoose from "mongoose";
import { systemRoles } from "../../src/utils/system-roles.utils.js";
const  { Schema, model } = mongoose;
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unqiue: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    emailConfirmed: {
      type: Boolean,
      default: false,
    },
    recoveryEmail: String,

    birthDate: Date,
    mobileNumber: {
      type: String,
      unqiue: true,
    },
    role: {
      type: String,
      enum: Object.values(systemRoles),
      default: "user",
    },
    status: {
      type: String,
      enum: ["offline", "online"],
      default: "offline",
    },
    OTP: String,
    expiredOTP:Date,
  },
  {
    timestamps: true,
  }
);
export default  mongoose.models.User || model("User", userSchema);