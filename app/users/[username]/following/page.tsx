import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Sidebar from "@/app/components/UI/Sidebar";
import Usercard from "@/app/components/Users/Usercard";
import Link from "next/link";
import Rightbar from "@/app/components/UI/Rightbar";

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
        if(error && status !== 406){
            console.log("error fetching username", error);
            redirect("/error");
        }
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
    <div className="flex flex-col sm:flex-row w-[100%] min-h-screen">
        <Sidebar username={username}/>
        <div className="flex flex-col w-[100%] sm:w-[60%] bg-gray-50 rounded-lg">
            <div className="p-4 sm:py-6 bg-blue-600 text-white text-lg sm:text-2xl font-bold sticky top-0 z-10 w-full">
                <div className="h-full w-full flex justify-between">
                    <span>Following</span>
                    <Link href={`/users/${params.username}`} className="">◅ Back</Link>
                </div>
            </div>
            <div className="flex flex-col w-full py-2">
                {followers?.map((follower) => (
                    <div className="w-full px-4 py-2">
                        <Usercard
                            username={follower.username}
                            filename={follower.filename}
                            currently_following={follower.currently_following}
                            uuid={follower.uuid}
                            key={follower.username}
                            isSelf={username === follower.username}
                        />
                    </div>
                ))}
            </div>
        </div>
        <Rightbar>
            <div className="flex flex-col items-center p-1 hidden">
                <Link href={`/users/${params.username}`}>
                    <button className="py-2 px-4 bg-blue-600 text-white font-bold text-sm md:text-base rounded-lg shadow hover:bg-blue-500 hover:shadow-md transition ease-in-out">
                        <p>
                            Return to 
                        </p>
                        <p>
                            {params.username}&#39;s profile
                        </p>
                    </button>
                </Link>
            </div>
        </Rightbar>
    </div>
    </>
    );
}