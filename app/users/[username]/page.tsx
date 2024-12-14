"use server"

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { writeFile } from "fs/promises";
import { Sidebar } from "@/app/components";
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image';
import path from "path";


const handlePostAction = async (formData: FormData) => {
    "use server"

    const supabase = await createClient();

    // Save img file in public/posts folder
    const img = formData.get("img") as File;
    const buffer = Buffer.from(await img.arrayBuffer());
    const filename = Date.now() + img.name.replaceAll(" ", "_");
    console.log(`\nsaving post with filename: ${filename}\n`);
    try {
        await writeFile(
        path.join(process.cwd(), "public/posts/" + filename), 
        buffer
        );
    } catch (error) {
        console.log("Error occurred while saving post image in public folder:\n");
        redirect('/error');
    }

    // send filename of uploaded post to the DB
    const {data, error} = await supabase.from("posts").insert({'filename': filename}).select("*").single();
    if(error){
        throw(error);
    }

    console.log("\n\npostid: ", data.postid);
    // finally, redirect to page for newly uploaded post
    //redirect(`/posts/${data.postid}`);
    
    redirect(`/posts/${data.postid.toString()}`);
}


export default async function UserPage({ params }: { params: { username: string }}) {
    const supabase = await createClient();

    // fetch current user
    const { data: { user }, } = await supabase.auth.getUser();
    if(!user){
      redirect('/accounts/login');
    }

    // fetch current username
    let username:string;
    {
        const {data, error, status} = await supabase.from('users').select('username').eq('uuid', user.id).single();
        if(error && status !== 406){
            console.log("error retrieving username: ", error);
            redirect('/error');
        }
        username = data?.username;
    }

/*
    const { data, error } = await supabase
        .from("users")
        .select("username, fullname, filename, created, bio, uuid")
        .eq("username", params.username)
        .single();
    if(error){
        console.log("error retreiving user data for user ", params.username);
        return (
            <div> 
                <p> User Not found :O </p>
                <Link href='/'> Return to Home Page </Link>
            </div>
        )
    }
*/
    // get user data
    let user_data: {
        fullname: string, 
        filename: string, 
        created: string, 
        bio: string,
        follower_count: number, 
        following_count: number,   
        posts: Array<{ filename: string; username: string; created: string; postid: number;}>;
    };
    const {data, error, status} = await supabase.rpc("get_user_info", {in_username: params.username});
    if(error && status !== 406){
        console.log("error retrieving user posts for user ", params.username, ": \n", error);
        redirect('/error');
    }
    user_data = data[0];
    
    // Map posts data to the expected format
    let postList: {filename: string, postid: number}[] =  user_data.posts?.map(
        (post: { filename: string; postid: number }) => ({
            filename: post.filename,
            postid: post.postid,    
        })
    ) || [];



    const readableDate = formatDistanceToNow(new Date(user_data.created), {addSuffix: true});

    // display page for user with [username]
    return (
    <>
    <div className="flex w-[100%]">
        <Sidebar username={username}/>
        <div className="flex flex-col justify-start items-start w-[80%]">
            <div className="w-[100%] flex items-center justify-between"> 
                <div className='flex flex-col items-center w-[40%]'>
                    <div className="h-50px">
                        <Image src={`/pfps/${user_data.filename}`} alt={`${params.username}'s pfp`} width={200} height={200} className='rounded-full'/>
                    </div>
                    <div className='text-3xl font-bold px-4'>
                        <p>{params.username}</p>
                    </div>
                    { data.uuid === user.id && 
                    <div className="">
                        <Link href="/accounts/edit">Edit Account</Link>
                    </div>
                    }
                </div>

                <div className="flex flex-col w-[40%] space-y-4">
                    <div>
                        <p>{user_data.fullname}</p>
                    </div>
                    <div>
                        <p>Joined {readableDate}</p>
                    </div>
                    <div>
                        <p>{user_data.bio}</p>
                    </div>
                </div>

                <div className="flex flex-col items-center w-[20%] text-xl space-y-4">
                    <div>
                        <Link href={`/users/${params.username}/followers`}> 
                            {user_data.follower_count} Followers
                        </Link>
                   </div>
                   <div>
                        <Link href={`/users/${params.username}/following`}> 
                            {user_data.following_count} Following
                        </Link> 
                   </div>
                </div>
            </div>
            
            <div className="w-[100%] flex justify-center">
                <div className="w-[100%] flex flex-col justify-center">
                    {params.username === username &&
                    <div className="bg-gray-100 w-[100%] flex flex-col justify-center items-center">
                        <h3>Make New Post</h3>
                        <form action={handlePostAction}>
                            <input type="file" name="img" required/>
                            <button type="submit"> Post </button>
                        </form>
                    </div>
                    }  

                    <div className="w-[80%] flex flex-wrap">
                        {
                        postList?.map((post: {filename: string; postid: Number}) => (
                            <div key={post.postid.toString()}>
                                <Link href={`/posts/${post.postid}`}>
                                    <div className="shadow-lg h-[225px] w-[210px] flex items-center justify-center m-2">
                                        <Image src={`/posts/${post.filename}`} alt="failed to load post" width={200} height={200} className=''/>
                                    </div>
                                </Link>
                            </div>
                        ))
                        }
                    </div>
                </div>
            </div>
        </div>
    </div>
    </>
    )
}