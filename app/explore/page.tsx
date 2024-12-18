import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Explore from "./explore-users";

export default async function ExplorePage(){
    const supabase = await createClient();
    const {data: {user}} = await supabase.auth.getUser();
    if(!user){
        redirect('/accounts/login');
    }

    const {data, error, status} = await supabase.from('users').select('username').eq('uuid', user.id).single();
    const username:string = data?.username;


    return (
    <>
        <div>
            <Explore username={username} user={user}/>
        </div>
    </>
    )
}