"use client"

import { useState } from "react";
import { handleFollow, handleUnfollow } from "@/app/actions";


export default function FollowUnfollow({uuid, currently_following}: {uuid:string, currently_following:boolean}){
    "use client"

    const [loading, setLoading] = useState(false);
    const [isFollowing, setIsFollowing] = useState(currently_following);
  
    const clientHandleFollow = async () => {
      setLoading(true);
      await handleFollow(uuid);
      setIsFollowing(true);
      setLoading(false);
    };
  
    const clientHandleUnfollow = async () => {
      setLoading(true);
      await handleUnfollow(uuid);
      setIsFollowing(false);
      setLoading(false);
    };

    return (
        <button
            disabled={loading}
            onClick={isFollowing ? clientHandleUnfollow : clientHandleFollow}
            className={`py-2 px-4 rounded font-bold text-sm text-base transition ${
            isFollowing
                ? "bg-gray-200 text-gray-700 border border-gray-300 hover:bg-gray-300"
                : "bg-blue-500 text-white hover:bg-blue-600"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
            {loading ? "Processing..." : isFollowing ? "Following" : "Follow"}
        </button>
    )
}
