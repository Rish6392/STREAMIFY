import User from "../models/User.js";

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