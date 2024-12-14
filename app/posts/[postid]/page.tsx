import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation";
import { Likes, Comments, Sidebar, PFP} from "@/app/components";
import { formatDistanceToNow } from 'date-fns';
import Image from "next/image";
import Link from "next/link";

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
    const likeCount = post_data.likes?.length || 0;
    let isLiked: boolean = post_data.likes?.findIndex((like) => like.username === username) >= 0


    return(<>
    <div className="flex w-[100%]">
        <Sidebar username={username}/>
        <div className="w-[60%] flex justify-center">
            <div className="flex flex-col items-center w-[800px] shadow-lg p-4">
                <div className="w-[100%] flex justify-between items-center">
                    <div className="flex items-center">
                        <PFP filename={post_data.pfp_filename}/>
                        <Link href={`/users/${post_data.username}`}>
                            {post_data.username}
                        </Link>
                    </div>
                    <div className="flex items-center">
                        {formatDistanceToNow(new Date(post_data.created), {addSuffix: true})}
                    </div>
                </div>
                <Image src={`/posts/${post_data.post_filename}`} alt="failed to load post" width={800} height={800}/>
                <Likes in_LikeCount={likeCount} in_isLiked={isLiked} postid={Number(params.postid)}/>
                <Comments in_commentList={post_data.comments || []} postid={Number(params.postid)} username={username} />
            </div>
        </div>
        <div className="w-[20%] bg-green-100">

        </div>
    </div>
    </>)
}