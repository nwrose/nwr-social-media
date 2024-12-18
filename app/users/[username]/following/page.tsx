import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Sidebar, Usercard } from "@/app/components";
import Link from "next/link";
import Image from "next/image";

export default async function FollowersPage({ params }: { params: { username: string }}){
    const supabase = await createClient();

    // verify user logged in 
    const {data: { user }} = await supabase.auth.getUser();
    if(!user){
        redirect('/accounts/login');
    }

    // fetch current username
    let username:string;
    {
        const {data, error, status} = await supabase.from('users').select('username').eq('uuid', user.id).single();
        username = data?.username;
    }

    // query DB for followerslist (uuid, username, and pfp-filename)
    const {data, error, status} = await supabase.rpc("get_following", { in_username: params.username, in_current_uuid: user.id });
    if(error && status !== 406){
        console.log("error during followers query:", error);
        redirect('/error');
    }

    const followers: {
        filename:string;
        username:string;
        currently_following: boolean;
        uuid:string;
    }[] = data || [];

    return(
    <>
    <div className="flex w-[screen] min-h-screen">
        <Sidebar username={username}/>
        <div className="flex flex-col items-center w-[60%]">
            <h1 className="py-10 text-4xl font-bold"> 
                Following
            </h1>
            <div className="flex flex-col justify-around items-center w-[100%]">
                {
                    followers?.map((follower: { filename: string; username: string; currently_following: boolean; uuid: string }) => (
                        <Usercard 
                            filename={follower.filename} 
                            username={follower.username} 
                            currently_following={follower.currently_following} 
                            uuid={follower.uuid}
                            key={follower.uuid}
                            isSelf={username === follower.username}
                        />
                    ))
                }
            </div>
        </div>
        <div className="w-[20%]">
            <Link href={`/users/${params.username}`}>
                <button className="m-10 bg-red-200 hover:bg-red-100 rounded border-2 hover:ease-in-out hover:text-gray-400 p-1">
                    Return to {params.username}'s profile
                </button>
            </Link>
        </div>
    </div>
    </>
    );
}