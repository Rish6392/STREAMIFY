import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {getOutgoingfriendReqs,getFriendRequests,acceptFriendRequest,sendFriendRequest, getRecommendedUsers,getMyFriends } from "../controllers/user.controller.js";



const router = express.Router();

//apply auth middleware to all routes
router.use(protectRoute);

router.get("/",getRecommendedUsers)
router.get("/friends",getMyFriends)

router.post("/friend-request/:id",sendFriendRequest);
router.put("/friend-request/:id/accept",acceptFriendRequest);
//reject friend req and many more can be created

router.get("/friend-requests",getFriendRequests);
router.get("/outgoing-friend-requests",getOutgoingfriendReqs);

export default router;