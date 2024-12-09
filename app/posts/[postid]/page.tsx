import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation";
import { Likes, Comments } from "@/app/components";
import Image from "next/image";
import { lchown } from "fs";
import { UUID } from "crypto";
import { comment } from "postcss";

export default async function showPost({ params }: { params: { postid: string }}){
    const supabase = await createClient();

    // fetch current user
    const { data: { user }, } = await supabase.auth.getUser();
    if(!user){
        redirect('/accounts/login');
    }

    const {data, error, status} = await supabase.rpc("get_post_info", {in_postid: Number(params.postid)});
    if(error && status !== 406){
        console.log("error while retrieving post with postid: ", params.postid.toString(), "\n", error);
        redirect('/error');
    }

    // retrieve likeCount and isLiked for post before rendering it
    let likeCount: number;
    let isLiked: boolean = false;
    {
        const {data, error, status} = await supabase.from("likes").select("uuid").eq("postid", Number(params.postid));
        if(error && status !== 406){
            console.log("error while retrieving post likes for post with postid ", params.postid, "\n", error);
            redirect('/error');
        }

        data?.map((val) => {
            if(val.uuid === user.id){
                isLiked = true;
            }
        });
        likeCount = data?.length || 0;
    }

    // retrieve list of comments for this post
    let commentList: { username: string, created: string, text: string, commentid: number }[] = [];
    {
        const {data, error, status} = await supabase.rpc("get_comments", {in_postid: Number(params.postid)});
        if(error && status !== 406){
            console.log("error while retrieving post comments for post with postid ", params.postid, "\n", error);
            redirect('/error');
        }

        if(data){
            commentList = data.map((val: { commentid: number, username: string, created: string, text: string}) => (
                {username: val.username, created: val.created, text: val.text, commentid: val.commentid}
            ));
        } 

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
    

    return(<>
    <div className="flex flex-col items-center">
        <div>
            <div>
                <p>{data?.[0].username}</p>
                <p>{data?.[0].created}</p>
            </div>
            <Image src={`/posts/${data?.[0].filename}`} alt="failed to load post" width={500} height={500}/>
        </div>

        <div>
            <Likes in_LikeCount={likeCount} in_isLiked={isLiked} postid={Number(params.postid)}/>
        </div>

        <div>
            <Comments in_commentList={commentList} postid={Number(params.postid)} username={username} />
        </div>
    </div>
    </>)
}