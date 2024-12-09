import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default async function FollowersPage({ params }: { params: { username: string }}){
    const supabase = await createClient();

    // verify user logged in 
    const {data: { user }} = await supabase.auth.getUser();
    if(!user){
        redirect('/accounts/login');
    }

    // query DB for followerslist (uuid, username, and pfp-filename)
    const {data, error, status} = await supabase.rpc("get_followers", { in_username: params.username });
    if(error && status !== 406){
        console.log("error during followers query:", error);
        redirect('/error');
    }

    return(
    <>
        <div className="h-screen flex flex-col items-center">
            <h2 className="py-10"> 
                Followers 
            </h2>
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
    </>
    );
}