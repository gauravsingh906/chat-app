import { configDotenv } from "dotenv";
configDotenv()
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { connectDB } from "./config.js";
import { ChatModel } from "./chat.schema.js";


//1. create server using http
const server = http.createServer()

//2. create socket.io server
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

//3. use socket.io event

io.on("connection", (socket) => {
    console.log("connection is established");

    //4. event listener
    socket.on('user_name', async (data) => {
        socket.username = data;
        //send old message to the client

        const allChats = await ChatModel.find().sort({ timeStamp: 1 }).limit(20);
        allChats.forEach(chat => {
            socket.emit("broadcast_message", chat);
        });



    })
    socket.on("message", async (data) => {
        console.log(data);
        let userMessage = {
            username: socket.username,
            message: data
        }
        const newChat = new ChatModel({
            username: socket.username,
            message: data,
            timeStamp: Date.now()
        })
        await newChat.save();
        socket.broadcast.emit("broadcast_message", userMessage);
    })
    socket.on("disconnect", () => {
        console.log("connection is disconnected");
    })
})

server.listen(3300, () => {
    connectDB();
    console.log("server is running on port 3300");
})

