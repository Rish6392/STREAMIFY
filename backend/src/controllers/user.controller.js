import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js"

export async function getRecommendedUsers(req,res) {
     try{
        const currentUserId = req.user.id;
        const currentUser = req.user

        const recommendedUsers= await User.find({
              $and:[
                {_id:{$ne:currentUserId}},// excludes current user
                {$id:{$nin:currentUser.friends}}, // excludes current users friends
                {isOnboarded:true}
              ]
        })
       res.status(200).json(recommendedUsers)
     }
     catch(error){
       console.log("Error in getRecommended controller",error.message);
       res.status(500).json({message:"Internal Server Error"});
     }
}

export async function getMyFriends(req,res) {
    try{
      const user = await user.findById(req.user.id)
      .select("friends")
      .populate("friends","fullName profilePic nativelanguage learningLanguage");
    }
    catch(error){
          console.log("Error in getMyfriends controller",error.message);
          res.status(500).json({
            message:"Internal Server Error"
          });
    }
}

export async function sendFriendRequest(req,res) {
  try{
    const myId = req.user.id;

    const {id:recipientId} = req.params

    //prevent sending req to yourself 
    if(myId === recipientId){
      return res.status(400).json({
        message:"You cannot send friend request to yourself"
      });
    }

    const recipient = await User.findById(recipientId)
    if(!recipient){
      return res.status(404).json({
        message:"Recipient not found"
      });
    }
    
    // check if user is already a friend
    if(recipient.friends.includes(myId)){
      return res.status(400).json({
        message:"You are already friends with the user"
      });
    }

    // check if a req already exist
    const existingRequest = await FriendRequest.findOne({
      $or:[
        {sender:myId,recipient:recipientId},
        {sender:recipientId,recipient:myId},
      ],
    });

    if(existingRequest){
      return res.status(400).json({
        message:"A friend request already exist between you and this user"
      });
    }

    //create a friend req
    const friendRequest = await FriendRequest.create({
      sender:myId,
      recipient:recipientId,
    });

    res.status(201).json({
      friendRequest
    })

  }
  catch(error){
    console.log("Error in sendFriendRequest controller",error.message);
    res.status(500).json({
      message:"Internal Server Error"
    });
  }
}
