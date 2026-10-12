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
const PORT = process.env.PORT || 5002;

const __dirname = path.resolve();

// Configure CORS for cookie-based auth
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "https://streamify-two-theta.vercel.app"
].concat(process.env.FRONTEND_ORIGIN ? [process.env.FRONTEND_ORIGIN] : []);

app.use(cors({
    origin: function (origin, callback) {
        // Allow non-browser requests with no origin
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        // Also allow any vercel.app subdomain if wanted
        if (/\.vercel\.app$/.test(origin)) return callback(null, true);
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
}));

// Preflight handled by cors middleware; ensure express parses JSON and cookies
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

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})
