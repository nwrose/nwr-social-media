import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import ExploreUsers from "./explore-users";

export default async function ExplorePage(){
    const supabase = await createClient();
    const {data: {user}} = await supabase.auth.getUser();
    if(!user){
        redirect('/accounts/login');
    }

    const {data, error, status} = await supabase.from('users').select('username').eq('uuid', user.id).single();
    if(error && status !== 406){
        console.log("error in explore: ", error);
        redirect('/error');
    }
    const username:string = data?.username;


    return (
    <>
        <div>
            <ExploreUsers username={username} user={user}/>
        </div>
    </>
    )
}