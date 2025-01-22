import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Sidebar, Usercard} from "@/app/components";
import Link from "next/link";

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
    const {data, error, status} = await supabase.rpc("get_followers", { in_username: params.username, in_current_uuid: user.id });
    if(error && status !== 406){
        console.log("error during followers query:", error);
        redirect('/error');
    }

    const followers: {
        filename: string;
        username: string;
        currently_following: boolean;
        uuid: string;
    }[] = data || [];

    return(
    <>
    <div className="flex flex-col sm:flex-row w-[100%] min-h-screen">
        <Sidebar username={username} />
        <div className="flex flex-col items-center w-[100%] sm:w-[60%] bg-gray-50 py-10 px-4 rounded-lg">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-700 mb-6">
                Followers
            </h2>
            <div className="flex flex-col gap-6 w-full">
                {followers?.map((follower) => (
                <Usercard
                    username={follower.username}
                    filename={follower.filename}
                    currently_following={follower.currently_following}
                    uuid={follower.uuid}
                    key={follower.username}
                    isSelf={username === follower.username}
                />
                ))}
            </div>
        </div>
        <div className="flex sm:items-start justify-center w-[100%] sm:w-[20%] py-10 shadow-lg bg-white">
            <Link href={`/users/${params.username}`}>
                <button className="py-2 mx-2 px-4 bg-blue-500 text-white font-bold text-sm md:text-base rounded-lg shadow hover:bg-blue-600 hover:shadow-md transition ease-in-out">
                    <p>
                        Return to 
                    </p>
                    <p>
                        {params.username}&#39;s profile
                    </p>
                </button>
            </Link>
        </div>
    </div>
    </>
    );
}