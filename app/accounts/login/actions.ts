"use server"

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from '@/utils/supabase/server';


export async function login(formData: FormData){
    "use server"

    const supabase = await createClient();

    // type-casting here for convenience
    // # TODO: Validate inputs (rather than typecast)
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data);
    if(error){
        console.log("error with supabase auth signInWithPassword:", error);
        return true;
    }

    revalidatePath('/', 'layout');
    redirect('/accounts/edit');
    return false;
}

export async function signup(){
    "use server"
    
    redirect('/accounts/create');
}