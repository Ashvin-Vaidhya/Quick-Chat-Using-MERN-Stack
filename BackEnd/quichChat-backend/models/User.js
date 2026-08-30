import mongoose from "mongoose";

const { Schema, model } = mongoose;
const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    password: { type: String, required: true, minlength: 6 },
    profilePic: { type: String, default: "" },
    bio: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.models.User || model("User", userSchema);
export default User;
