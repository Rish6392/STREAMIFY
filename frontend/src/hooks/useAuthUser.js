import React from 'react'
import { useQuery } from "@tanstack/react-query"; //useQuery: A React hook from react-query for fetching and caching data.
import { getAuthUser } from "../lib/api"; //getAuthUser: A function that

const useAuthUser = () => {
  const authUser = useQuery({
    queryKey: ["authUser"],  // uniquely identifies this request in the cache.
    queryFn: getAuthUser, // function to fetch the data.
    retry: false,
  });

  return {isLoading: authUser.isLoading,authUser: authUser.data?.user}
}

export default useAuthUser
