import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Explore from "./explore-users"
import { followUser } from "./actions";

export default async function ExplorePage(){
    const supabase = await createClient();
    const {data: {user}} = await supabase.auth.getUser();
    if(!user){
        redirect('/accounts/login');
    }

    const handleFollow = async (formData: FormData) => {
        "use server"
        
        const username = formData.get('username') as string;
        const success = await followUser(username);
        return success;
    }

    return (
    <>
        <div>
            <Explore user={user} handleFollow={handleFollow}/>
        </div>
    </>
    )
}