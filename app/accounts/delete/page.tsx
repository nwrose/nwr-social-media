import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { deleteAccount } from "./actions";

export default async function Delete(){
    const supabase = await createClient();
    const { data: { user }, } = await supabase.auth.getUser();
    if(!user){
      redirect('/accounts/login');
    }

    return(
        <>
        <div>
            <p>Confirm Delete Account</p>
            <p>WARNING: This action CANNOT be undone</p>
            <button formAction={deleteAccount} className="bg-red">DELETE ACCOUNT</button>
        </div>
        </>
    )
}