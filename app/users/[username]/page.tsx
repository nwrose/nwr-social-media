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
        console.log("Error occurred while saving post image in public folder:\n", error);
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

    // get user data    
    const {data, error, status} = await supabase.rpc("get_user_info", {in_username: params.username});
    if(error && status !== 406){
        console.log("error retrieving user posts for user ", params.username, ": \n", error);
        redirect('/error');
    }
    const user_data: {
        fullname: string, 
        filename: string, 
        created: string, 
        bio: string,
        follower_count: number, 
        following_count: number,   
        posts: Array<{ filename: string; username: string; created: string; postid: number;}>;
    } = data[0];
    
    // Map posts data to the expected format
    const postList: {filename: string, postid: number}[] =  user_data.posts?.map(
        (post: { filename: string; postid: number }) => ({
            filename: post.filename,
            postid: post.postid,    
        })
    ) || [];



    const readableDate = formatDistanceToNow(new Date(user_data.created), {addSuffix: true});

    // display page for user with [username]
    return (
<>
<div className="flex w-full min-h-screen bg-gray-50">
    {/* Sidebar */}
    <Sidebar username={username} />

    {/* Main Content */}
    <div className="flex flex-col flex-grow p-6 space-y-8 bg-gray-100">
        <div className="p-6  bg-white shadow-md rounded-lg w-full flex flex-col items-center">
            {/* User Info Section */}
            <div className="flex flex-col md:flex-row items-center justify-around w-full md:w-5/6 ">
                {/* Profile Picture and Username */}
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="relative w-40 h-40 rounded-full border-4 border-blue-400 overflow-hidden">
                        <Image 
                            src={`/pfps/${user_data.filename}`} 
                            alt={`${params.username}'s profile picture`} 
                            fill 
                            style={{ objectFit: 'cover' }} 
                            sizes="160px"
                        />
                    </div>
                    <h1 className="text-2xl font-bold">{params.username}</h1>
                    {data.uuid === user.id && (
                        <Link href="/accounts/edit" className="text-blue-500 hover:underline">
                            Edit Account
                        </Link>
                    )}
                </div>

                {/* Full Name and Bio */}
                <div className="flex flex-col space-y-2 items-center justify-center h-full w-1/2">
                    <p className="text-lg font-semibold">{user_data.fullname}</p>
                    <p className="text-sm text-gray-500">Joined {readableDate}</p>
                    <p className="text-gray-700 text-center">{user_data.bio}</p>

                    {/* Followers and Following */}
                    <div className="flex flex-col items-center justify-around h-2/3  space-y-4">
                        <Link href={`/users/${params.username}/followers`} className="text-lg font-semibold text-blue-500 hover:bg-gray-100 p-2">
                            {user_data.follower_count} Followers
                        </Link>
                        <Link href={`/users/${params.username}/following`} className="text-lg font-semibold text-blue-500 hover:bg-gray-100 p-2">
                            {user_data.following_count} Following
                        </Link>
                </div>
                </div>
                {params.username === username && (
            /* New Post Section */
            <div className="bg-gray-100 rounded-lg shadow-md flex flex-col justify-center items-center w-[50%] p-6 mt-10">
                <h2 className="text-lg font-bold mb-4">Make New Post</h2>
                <form action={handlePostAction} className="flex flex-row items-center space-y-0 space-x-4">
                    <input type="file" name="img" required className="border rounded p-2" />
                    <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                        Post
                    </button>
                </form>
            </div>
            )}
            </div>

        </div>


        {/* User's Posts */}
        <div className="flex flex-col items-center w-full p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-6 text-center">Posts</h2>
            <div className="flex flex-wrap justify-center w-[80%]">
                {postList?.map((post: { filename: string; postid: number }) => (
                    <div
                        key={post.postid.toString()}
                        className="relative bg-white shadow-lg rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 p-2 m-2"
                        style={{ width: '180px', height: '180px' }}
                    >
                        <Link href={`/posts/${post.postid}`}>
                            {/* Image Container */}
                            <div className="relative w-full h-full">
                                <Image
                                    src={`/posts/${post.filename}`}
                                    alt="Post image"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    </div>
</div>
</>

    )
}