import express from "express"
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();

import path from "path";


import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js"
import { connectDB } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT;

const __dirname = path.resolve();

app.use(cors({
    origin: [
        "http://localhost:5173", 
        "http://127.0.0.1:5173",
        "https://streamify-two-theta.vercel.app",
        /\.vercel\.app$/
    ], 
    credentials: true, // Allow frontend to send cookies
}));
app.use(express.json()); //req.body
app.use(cookieParser()); // req.body

// Routes
app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/chat",chatRoutes);

if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname,"../frontend/dist")));

    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"));
    })
}

// For local development
if (process.env.NODE_ENV !== "production") {
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`);
        connectDB();
    });
} else {
    // For Vercel serverless
    connectDB();
}

// Export for Vercel
export default app;