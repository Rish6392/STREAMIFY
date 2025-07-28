import React from 'react'
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest, getFriendRequests } from "../lib/api";

const NotificationsPage = () => {


 const queryClient = useQueryClient();

 const {data:friendRequests,isLoading} = useQuery({
  queryKey:["friendRequests"],
  queryFn:getFriendRequests,
 })

 const {mutate:acceptRequestMutation,isPending} = useMutation({
  mutationFn:acceptFriendRequest,
  onSuccess:() => {
    queryClient.invalidateQueries({queryKey:["friendRequests"]});
    queryClient.invalidateQueries({queryKey:["friends"]});
  }
 })

 const incomingRequests = friendRequests?.incomingReqs || []
 const acceptedRequests = friendRequests?.acceptedReqs || []

  return (
    <div>
      notifications page
    </div>
  )
}

export default NotificationsPage
