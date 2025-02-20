"use server"

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";


// sign out current user
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


// insert post to DB with form inputted filename
export async function handlePostAction(formData: FormData){
    "use server"
    
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if(!user){
        redirect('/accounts/login');
    }

    const filename = formData.get("filename")?.toString();
    const caption = formData.get("caption")?.toString();
    const fam_id: number | null = Number(formData.get("fam_id"));

    if(!filename){
        console.log("no filename    : | \n");
        redirect('/error');
    }

    // send filename of uploaded post to the DB
    console.log("\nSending post do DB with params: \nuuid:", user.id, "\nfilename:", filename, "\ncaption:", caption, "\nfam_id:", fam_id, '\n');
    const {data, error, status} = await supabase.from("posts").insert({'filename': filename, 'caption': caption, 'fam_id': (fam_id === -1 ? null : fam_id) }).select("postid").single();
    if(error && status !== 406 || !data){
        console.log("error adding post to supabase: ", error);
        redirect('/error');
    }

    redirect(`/posts/${data.postid}`);
}


// delete post with postid from DB
export async function deletePost(postid:number){
    "use server"

    const supabase = await createClient();

    const {error, status} = await supabase.from("posts").delete().eq("postid", postid);
    if(error && status !== 406){
        console.log("error deleting post", error);
        redirect('/error');
    }
}


// redirect after a deleted post
export async function deletedRedirect(username:string){
    "use server"

    redirect(`/users/${username}`);
}


// insert like to DB for post with postid and user with auth.uid
export async function handleLike(postid: number){
    "use server"

    const supabase = await createClient();

    const {error} = await supabase.from("likes").insert({postid: postid});
    if(error){
        console.log("error liking post with postid", postid, "\n", error);
    }
}


// delete like from DB for post with postid and user with auth.uid
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

// insert following relationship to DB: user with auth.uid follows user with uuid
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


// delete following relatonship from DB: user with auth.uid unfollows user with uuid
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


// insert comment text to DB for user with auth.uid, post with postid
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


// delete comment from DB with comment_id
export async function handleCommentDelete(commentid: number){
    const supabase = await createClient();

    const {error} = await supabase.from("comments").delete().eq("commentid", commentid);
    if(error){
        console.log("error removing comment from DB", error);
    }
}


// insert comment like to DB for comment with commentid and user with auth.uid
export async function handleCommentLike(commentid: number){
    const supabase = await createClient();

    const {error, status} = await supabase.from("comment_likes").insert({commentid});
    if(error && status !== 406){
        throw error;
    }
}


// delete comment like from DB for comment with commentid and user with auth.uid
export async function handleCommentUnlike(commentid: number){
    const supabase = await createClient();

    const {data: {user}} = await supabase.auth.getUser();
    if(!user){
        redirect("/accounts/login");
    }

    const {error, status} = await supabase.from("comment_likes").delete().eq("commentid", commentid).eq("uuid", user.id);
    if(error && status !== 406){
        throw(error);
    }
}


// insert fam membership into DB for user with uuid and fam with fam_id
export async function handleFamJoin(fam_id: number){
    const supabase = await createClient();
    const {error, status } = await supabase.from("members").insert({fam_id});
    if(error && status !== 406){
        throw error;
    }
}


// delete fam membership from DB for current user and fam with fam_id
export async function handleFamLeave(fam_id: number){
    const supabase = await createClient();
    const {data: {user}} = await supabase.auth.getUser();
    if(!user){
        redirect("/accounts/login");
    }

    const {error, status} = await supabase.from("members").delete().eq("fam_id", fam_id).eq("uuid", user.id);
    if(error && status !== 406){
        throw error;
    }
}


// verify fam name does not exist in DB already
export async function checkFamNameAvailable(name: string){
    const supabase = await createClient();
    const {data, error, status} = await supabase.from("fams").select("*").eq("name", name).single();
    if(error && status !== 406){
        throw error;
    }

    if(data) return false; 
    else return true; // data is null (name is available)
}


// insert new fam into DB with name, description, filename
export async function handleFamCreateAction(formData: FormData){
    const supabase = await createClient();
    const {error, status } = await supabase.from("fams").insert({name: formData.get("name"), description: formData.get("description"), filename: formData.get("filename")});
    if(error && status !== 406){
        throw error;
    }
}