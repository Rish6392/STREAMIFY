import express from "express"
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js"
import { connectDB } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT;

app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"], // Allow requests from this origin
    credentials: true, // Allow frontend to send cookies
}));
app.use(express.json()); //req.body
app.use(cookieParser()); // req.body

// Routes
app.use("/api/auth",authRoutes);
app.use("api/users",userRoutes);
app.use("api/auth",chatRoutes);

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})