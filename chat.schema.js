import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    username: String,
    message: String,
    timeStamp: Date
});

export const ChatModel = mongoose.model("Chat", chatSchema)