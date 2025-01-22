"use server"

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { CldUploadButtonClient, Sidebar } from "@/app/components";
import { formatDistanceToNow } from 'date-fns';
import { CldImage } from '@/app/components';
import Link from 'next/link';




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
    <div className="flex flex-col sm:flex-row w-full min-h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar username={username} />

        {/* Main Content */}
        <div className="flex flex-col flex-grow p-6 space-y-8 bg-gray-100 w-[100%] sm:w-[60%]">
            <div className="p-6  bg-white shadow-md rounded-lg w-full flex flex-col items-center">
                {/* User Info Section */}
                <div className="flex flex-col lg:flex-row items-center justify-around w-full lg:w-5/6 ">
                    {/* Profile Picture and Username */}
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="relative w-40 h-40 rounded-full border-4 border-blue-400 overflow-hidden">
                            <CldImage 
                                src={user_data.filename} 
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
                    <div className="flex flex-col space-y-2 items-center justify-center h-full lg:w-1/2 mb-6">
                        <p className="text-lg font-semibold">{user_data.fullname}</p>
                        <p className="text-sm text-gray-500">Joined {readableDate}</p>
                        <p className="text-gray-700 text-center">{user_data.bio}</p>

                        {/* Followers and Following */}
                        <div className="flex flex-col items-center justify-around h-2/3 space-y-4">
                            <Link href={`/users/${params.username}/followers`} className="text-lg font-semibold text-blue-500 hover:bg-gray-100 p-2">
                                {user_data.follower_count} Followers
                            </Link>
                            <Link href={`/users/${params.username}/following`} className="text-lg font-semibold text-blue-500 hover:bg-gray-100 p-2">
                                {user_data.following_count} Following
                            </Link>
                        </div>
                    </div>
                    {params.username === username && (
                        <CldUploadButtonClient uploadPreset="posts_and_pfps"/>
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
                                <div className="relative w-full h-full">
                                    <CldImage
                                        src={post.filename}
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