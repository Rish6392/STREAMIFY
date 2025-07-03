import express from "express";
import {onboard, login, logout, signup } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";



const router = express.Router()

router.post("/signup",signup);

router.post("/login",login);

router.post("/logout",logout);
//forget password and many more can be created

router.post("/onboarding",protectRoute,onboard);

//check if User is logged in or not
router.get("/me",protectRoute,(req,res)=>{
      res.status(200).json({success:true,user:req.user});
});


export default router;
