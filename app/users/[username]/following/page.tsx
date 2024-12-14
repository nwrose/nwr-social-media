import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/app/components";
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
    const {data, error, status} = await supabase.rpc("get_following", { in_username: params.username });
    if(error && status !== 406){
        console.log("error during followers query:", error);
        redirect('/error');
    }

    return(
    <>
    <div className="flex w-[screen] min-h-screen">
        <Sidebar username={username}/>
        <div className="flex flex-col items-center w-[60%]">
            <h1 className="py-10"> 
                Following
            </h1>
            <div className="flex flex-col justify-around items-center">
                {
                    data?.map((follower: {filename: string; username: string}) => (
                        <Link href={`/users/${follower.username}`} key={follower.username} className="flex items-center">
                            <div>
                                <Image src={`/pfps/${follower.filename}`} alt={`${follower.username}'s pfp`} width={50} height={50} className="rounded-full"/>
                            </div>
                            <p>
                                {follower.username}
                            </p>
                        </Link>
                    ))
                }
            </div>
        </div>
        <div className="w-[20%]">
            <Link href={`/users/${params.username}`}>
                <button className="m-10 bg-red-100 rounded border-2 hover:border-black hover:ease-in-out hover:text-gray-400">
                    Return to {params.username}'s profile
                </button>
            </Link>
        </div>
    </div>
    </>
    );
}