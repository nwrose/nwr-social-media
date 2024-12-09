"use server"

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { userAgent } from "next/server";

export async function handleLike(postid: number){
    "use server"

    const supabase = await createClient();

    const {error} = await supabase.from("likes").insert({postid: postid});
    if(error){
        console.log("error liking post with postid", postid, "\n", error);
    }
}

export async function handleUnlike(postid: number){
    "use server"

    const supabase = await createClient();
    const {data: {user}} = await supabase.auth.getUser();
    if(!user){
        redirect("/accounts/login");
    }

    const {error} = await supabase.from("likes").delete().eq("postid", postid).eq("uuid", user.id);
    if(error){
        console.log("error removing like from DB", error);
    }
}

// requires postid and input_text
export async function handleComment(formData: FormData){
    const supabase = await createClient();

    const user = await supabase.auth.getUser();
    if(!user){
        redirect('/login');
    }

    const {data, error} = await supabase.from("comments").insert({postid: formData.get("postid"), text: formData.get("text")}).select("*").single();
    if(error){
        console.log("serverside error while inserting comment to database: ", error);
    }
    if(!data){
        redirect('/error');
    }

    return {username: formData.get("username") as string, created: data?.created, text: data?.text, commentid: data?.commentid};
}


// requires comment_id
export async function handleCommentDelete(commentid: number){
    const supabase = await createClient();

    const {error} = await supabase.from("comments").delete().eq("commentid", commentid);
    if(error){
        console.log("error removing comment from DB", error);
    }
}