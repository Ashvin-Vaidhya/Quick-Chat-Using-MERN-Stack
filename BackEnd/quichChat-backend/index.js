import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { Server } from 'socket.io';
import connectDB from './lib/conectDB.js';
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoute.js';
dotenv.config();

const app = express();
const server = http.createServer(app);
const __dirname = path.resolve();

const port = process.env.PORT || 3000;

//Initialize socket.io server
export const io = new Server(server, {
  cors: {origin: "*"}
})

//store online users
export const userSocketMap = {};

//Socket.io conection handeler function
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId
  console.log("User connected", userId)
  if(userId) userSocketMap[userId] = socket.id;

  //Emit all online users to all conected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
      console.log("User disconnected", userId);
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap))
  })
})


//middleware to parse data
app.use(cors());
app.use(express.json({ limit: '4mb' }));
app.use(express.urlencoded({ extended: false, limit: '4mb' }));
app.use('/api/status', (req, res) => { res.json({ status: 'Server is running' }) });

//mongobd conection
connectDB()

//route setup
app.use('/api/auth', userRouter);
app.use('/api/messages', messageRouter)

// Serve frontend static assets in production
if (process.env.NODE_ENV === "production") {
  const rootDist = path.join(__dirname, 'dist');
  const frontendDistPath = fs.existsSync(rootDist) ? rootDist : path.join(__dirname, 'FrontEnd', 'quichChat-fronEnd', 'dist');
  app.use(express.static(frontendDistPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

server.listen(port, () => {
console.log(`Server is running on port ${port}`);
});