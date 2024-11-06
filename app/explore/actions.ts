import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function followUser(username: String){
    const supabase = await createClient();

    // verify user logged in
    const {data: {user}} = await supabase.auth.getUser();
    if(!user){
        redirect('/accounts/login');
    }

    // send request to DB to insert username into following table
    const {error, status} = await supabase.from('following').insert({username});

    if(error && status !== 406){
        console.log("error folllowing user from explore page:", error);
        redirect('/error');
    }

    return true;
}