"use server"

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";


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


// follow a user with inputted uuid
export async function handleFollow(uuid: string){
    "use server"

    const supabase = await createClient();
    
    // send request to DB to insert username into following table
    const uuid2 = uuid;
    const {error, status} = await supabase.from('following').insert({uuid2});

    if(error && status !== 406){
        console.log("error folllowing user from usercard:", error);
        redirect('/error');
    }
    return true;
}


// unfollow a user with an inputted uuid
export async function handleUnfollow(uuid: string){
    "use server"

    const supabase = await createClient();

    // get current uuid via auth
    const user = await supabase.auth.getUser();
    if(!user){
        redirect('/login');
    }

    const {error, status} = await supabase.from("following").delete().eq("uuid1", user.data.user?.id).eq("uuid2", uuid);
    if(error && status !== 406){
        console.log("error unfollowing user", error);
        redirect('/error');
    }
}


export async function deletePost(postid:number){
    "use server"

    const supabase = await createClient();

    const {error, status} = await supabase.from("posts").delete().eq("postid", postid);
    if(error && status !== 406){
        console.log("error deleting post", error);
        redirect('/error');
    }
}

export async function deletedRedirect(username:string){
    "use server"

    redirect(`/users/${username}`);
}


export async function handleSignout(){
    "use server"

    const supabase = await createClient();
    supabase.auth.signOut();
    redirect('/accounts/login');
}



// Verify username choice
export async function verifyUsername(username: string | null){
    "use server"

    // username must be >= 3 chars
    if(!username || username.length < 3){
        return "SHORT";
    }

    // username must not contain whitespace
    if(username.match(/\s/) !== null){
        return "SPACE";
    }

    const supabase = await createClient();

    const user = await supabase.auth.getUser();
    if(!user){
        redirect('/accounts/login');
    }
    const {data, error} = await supabase.from('users').select('uuid').eq('username', username);
    if(error){
        console.log("error in actions.ts with verifyUsername", error);
        redirect('/error');
    }

    // username cannot exist in database already (must be unique)
    if(data.length > 0 && data[0].uuid !== user.data.user?.id){
        return "TAKEN";
    }
  
    return "GOOD";
}


// function for uploading a post
export async function handlePostAction(formData: FormData){
    "use server"
    
    const supabase = await createClient();

    const filename = formData.get("filename")?.toString();

    console.log(`\nsaving post with filename: ${filename}\n`);
    if(!filename){
        console.log("no filename    : | \n");
        redirect('/error');
    }

    // send filename of uploaded post to the DB
    const {data, error} = await supabase.from("posts").insert({'filename': filename}).select("*").single();
    if(error){
        console.log("error adding post to supabase: ", error);
        redirect('/error');
    }

    redirect(`/posts/${data.postid.toString()}`);
}