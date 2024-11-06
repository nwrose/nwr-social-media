import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function FollowersPage(){
    const supabase = await createClient();

    // verify user logged in 
    const {data: { user }} = await supabase.auth.getUser();
    if(!user){
        redirect('/accounts/login');
    }

    // query DB for followerslist (uuid, username, and pfp-filename)
    const {data, error, status} = await supabase
        .from('users')
        .select('filename, username, following!inner(username)')
        .eq('following.uuid', user?.id);
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
                    data?.map((follower) => (
                        <div>
                            <div>
                                <Image src={`/pfps/${follower.filename}`} alt={`${follower.username}'s pfp`} width={500} height={500}/>
                            </div>
                            <p>
                                {follower.username}
                            </p>
                        </div>
                    ))
                }
            </div>
        </div>
    </>
    );
}