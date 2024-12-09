"use server"

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { writeFile } from "fs/promises";
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

    // get user data
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

    // get user posts'
    let postList: {filename: string, postid: number}[] = [];
    {
        const {data, error } = await supabase.rpc("get_user_posts", {in_username: params.username});
        if(error){
            console.log("error retrieving user posts for user ", params.username, ": \n", error);
            redirect('/error');
        }
        
        // Map posts data to the expected format
        postList = data?.map(
            (post: { filename: string; postid: number }) => ({
                filename: post.filename,
                postid: post.postid,
            })
        ) || [];

    }

    const readableDate = data.created; // TODO: make more readable

    // display page for user with [username]
    return (
    <>
        <div className="flex flex-col justify-start items-center h-screen">
            { data.uuid === user.id && 
            <div className="w-screen">
                <Link href="/accounts/edit">Edit Account</Link>
            </div>
            }

            <div className="w-[80%] flex flex-col items-center justify-start"> 
                <div className='flex items-center'>
                    <div className="h-50px">
                        <Image src={`/pfps/${data?.filename}`} alt={`${data?.username}'s pfp`} width={50} height={50} className='rounded-full'/>
                    </div>
                    <div className='text-3xl font-bold px-4'>
                        <p>{data?.username}</p>
                    </div>
                </div>

                <div>
                    <p>{data?.fullname}</p>
                </div>

                <div>
                    <p>Active user since: {readableDate}</p>
                </div>

                <div>
                    <p>Bio: {data?.bio}</p>
                </div>
            </div>
            
            <div>
                <div>
                    <div hidden={data.uuid !== user.id}>
                        <h3>Make New Post</h3>
                        <form action={handlePostAction}>
                            <input type="file" name="img" required/>
                            <button type="submit"> Post </button>
                        </form>
                    </div>

                    <div className="w-[80%] flex flex-wrap">
                        {
                        postList?.map((post: {filename: string; postid: Number}) => (
                            <div key={post.postid.toString()}>
                                <Link href={`/posts/${post.postid}`}>
                                    <Image src={`/posts/${post.filename}`} alt="failed to load post" width={50} height={50} className=''/>
                                </Link>
                            </div>
                        ))
                        }
                    </div>
                </div>
            </div>
        </div>
    </>
    )
}