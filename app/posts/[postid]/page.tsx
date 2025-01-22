import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation";
import { Sidebar, DeletePost, Post, CaptionChange, AspectChange } from "@/app/components";

export default async function showPost({ params }: { params: { postid: string }}){
    const supabase = await createClient();

    // fetch current user
    const { data: { user }, } = await supabase.auth.getUser();
    if(!user){
        redirect('/accounts/login');
    }

    // get current user's username
    let username: string;
    {
        const {data, error, status} = await supabase.from("users").select("username").eq("uuid", user.id).single();
        if(error && status !== 406){
            console.log("error getting current username", error);
            redirect("/error");
        }
        username = data?.username;
    }

    // get the necessary data for this post
    const {data, error, status} = await supabase.rpc("get_post_info", {in_postid: Number(params.postid)});
    if(error && status !== 406){
        console.log("error while retrieving post with postid: ", params.postid.toString(), "\n", error);
        redirect('/error');
    }
    const post_data: {
        post_filename: string,
        created: string,
        username: string,
        pfp_filename: string,
        comments: Array<{commentid: number; text:string; created:string; username:string;}>,
        likes: Array<{uuid: string; username:string;}>
    } = data?.[0];

    // get like variables
    const likeCount = post_data?.likes?.length || 0;
    const isLiked: boolean = post_data?.likes?.findIndex((like) => like.username === username) >= 0;


    return(<>
    <div className="flex flex-col sm:flex-row w-[100%] min-h-screen">
        <Sidebar username={username}/>
        <div className="w-[100%] sm:w-[60%] min-h-screen flex flex-col items-center justify-center py-4 sm:py-2">
            <Post my_username={username} postid={params.postid} likeCount={likeCount} isLiked={isLiked} post_data={post_data}/>
        </div>
        <div className="w-[100%] sm:w-[20%]"/>
        <div className="w-[100%] sm:w-[20%] flex flex-col items-center sm:fixed sm:top-0 sm:right-0 sm:h-full shadow-lg bg-white px-4">
            {(post_data.username === username) && 
            <div className="w-full flex flex-col justify-between sm:min-h-screen py-4">
                <div className="w-full pb-4">
                    <CaptionChange/>
                    <AspectChange/>
                </div>
                <DeletePost postid={Number(params.postid)} username={post_data.username}/>
            </div>
            }
        </div>
    </div>
    </>)
}