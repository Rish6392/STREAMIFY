import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { getRecommendedUsers,getUserFriends, 
         getOutgoingFriendReqs,sendFriendRequest} from '../lib/api';


const HomePage = () => {

  const queryClient = useQueryClient();
  //Local state to track the IDs of users to whom a friend request has already been sent.
  const [outgoingRequestsIds,setOutgoingRequestsIds]= useState(new Set());



   const {data:friends=[],isLoading:loadingFriends}= useQuery({
    queryKey:["friends"],
    queryFn:getUserFriends
   })

    const {data:recommendedUsers=[],isLoading:loadingUsers}= useQuery({
    queryKey:["friends"],
    queryFn:getRecommendedUsers
   })

   //Fetches the list of outgoing friend requests (requests sent but not yet accepted).
    const {data:outgoingFriendReqs=[]}= useQuery({
    queryKey:["outgoingFriendReqs"],
    queryFn:getOutgoingFriendReqs
   })

   //useMutation handles sending a friend request.
   //sendRequestMutation is the function you call to trigger the mutation.
   //onSuccess ensures that after a request is sent, React Query
   //will refetch the list of outgoing requests to update the UI.
   const {mutate:sendRequestMutation,isPending}=useMutation({
     mutationFn:sendFriendRequest,
     onSuccess:() => queryClient.invalidateQueries({queryKey:["outgoingFriendReqs"]}),
   })

  //Whenever outgoingFriendReqs changes:
  //A new Set of IDs is built from it.
  //The local outgoingRequestsIds state is updated.
  //This helps in UI logic — for example, disabling a 
  //"Send Request" button for users who already have a request sent.
   useEffect(()=>{
    const outgoingIds = new Set()
    if(outgoingFriendReqs && outgoingFriendReqs.length>0){
      outgoingFriendReqs.forEach((req)=>{
        outgoingIds.add(req.id)
      })
      setOutgoingRequestsIds(outgoingIds)
    }
   },[outgoingFriendReqs]);
  
  return (
    <div>
      Home
    </div>
  )
}

export default HomePage

