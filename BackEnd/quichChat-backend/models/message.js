import mongoose from "mongoose";

const { Schema, model } = mongoose;
const userMessage = new Schema(
  {
    senderId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    receiverId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    text: {type: String},
    image: {type: String},
    seen: {type: Boolean, default: false}
  },
  { timestamps: true }
);

const Message = mongoose.models.Message || model("Message", userMessage);
export default Message;
