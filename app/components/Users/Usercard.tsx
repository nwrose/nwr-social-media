"use client"

import Link from "next/link";
import FollowUnfollow from "@/app/components/Users/FollowUnfollow";
import PFP from "@/app/components/Users/pfp";

export default function Usercard({
    username,
    filename,
    currently_following,
    uuid,
    isSelf,
  }: {
    username: string;
    filename: string;
    currently_following: boolean;
    uuid: string;
    isSelf: boolean;
  }) {
    "use client"

    return (
      <div className="w-full p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between">
          <Link href={`/users/${username}`} className="flex items-center gap-4">
            <PFP filename={filename} />
            <div className="text-lg md:text-2xl font-bold text-gray-700">
              {username}
            </div>
          </Link>
          {!isSelf && (
            <FollowUnfollow uuid={uuid} currently_following={currently_following}/>
          )}
        </div>
      </div>
    );
}
  
