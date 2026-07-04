import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";

import { connectDB } from "./connectDB.js";
import authRoutes from "./routes/auth.route.js";
import quizRoutes from "./routes/quiz.route.js";
import errorHandler from "./middlewares/errorHandler.js";
import AppError from "./utils/AppError.js";
import { setupBattleSocket } from "./socket/battleHandler.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.BACKEND_PORT || 8080;
const __dirname = path.resolve();

// ---- Socket.IO setup ----
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});
setupBattleSocket(io);

app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/quiz", quizRoutes);

// ==== unknown routes ====
app.all("/api/*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// ==== global error handler ====
app.use(errorHandler);

// ==== static folder ====
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/Frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "Frontend", "dist", "index.html"));
  });
}

// ==== app.listen() ====
const startServer = async () => {
  const dbConnected = await connectDB();
  if (dbConnected) {
    console.log("DB connected!");
    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} - http://localhost:${PORT}`);
    });
  } else {
    console.error("Error connecting to the database. Server not started.");
    process.exit(1);
  }
};

startServer();