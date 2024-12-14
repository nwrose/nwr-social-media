import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { formatDistanceToNow } from 'date-fns';
import Link from "next/link";
import Image from "next/image";
import {Likes, Comments, Sidebar} from "@/app/components";


const Home:React.FC = async () => {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if(!user) {
        redirect('/accounts/login/');
    }

    const {data, error, status} = await supabase.from('users').select('username').eq('uuid', user.id).single();
    if(error && status !== 406){
        console.log("Index page error fetching user DB info:", error);
        redirect('/error');
    }

    const username:string = data?.username;
    let posts: {
        p_postid: number, 
        p_created: string, 
        p_filename: string, 
        p_username: string, 
        p_pfp_filename: string,   
        comments: Array<{ commentid: number; text: string; created: string;username: string;}>;
        likes: Array<{ uuid: number; username: string;}>;
    }[];
    {
        const {data, error, status} = await supabase.rpc('get_main_feed', {in_uuid: user.id});
        if(error && status !== 406){
            console.log("error fetching main feed: ", error);
            redirect('/error');
        }
        posts = data;
        console.log(data);
    }

    //posts[0].likes.map((like) => (console.log(like)));

    return (
        <div className="flex text-lg w-[100%]">
            <Sidebar username={username}/>
            <div className="bg-green-100 w-[60%] flex flex-col justify-start items-center space-y-4">
                <div className="bg-green-200 flex items-center justify-center">
                    FEED TOP ROW
                </div>
                {
                // DISPLAY POSTS //
                posts.map((post) => (
                    <div key={`${post.p_postid}`} className="w-[80%] bg-green-200 p-2 shadow">
                        <div className="flex w-[100%]">
                            <div className="w-[100%]">
                                <Link href={`/users/${post.p_username}`} className="flex space-between items-center">
                                    <Image src={`/pfps/${post.p_pfp_filename}`} alt="pfp" width={36} height={36} className="rounded-full border-4 border-blue-600 m-2"/>
                                    <span className="font-bold text-xl text-blue-600">{post.p_username}</span>
                                </Link>
                            </div>
                            <div className="w-[30%] flex items-center justify-end">
                                <Link href={`/posts/${post.p_postid}`}>
                                    <span className="text-blue-300 m-2">
                                        {formatDistanceToNow(new Date(post.p_created), {addSuffix: true})}
                                    </span>
                                </Link>
                            </div>
                        </div>
                        <div>
                            <Image src={`/posts/${post.p_filename}`} alt="post" width={1000} height={1000} />
                        </div>
                        <div className="flex flex-col items-center w-[100%] text-base">
                            <div className="w-[100%] flex justify-start">
                                <Likes in_LikeCount={post.likes?.length || 0} in_isLiked={post.likes?.findIndex((like) => like.username === username) >= 0} postid={post.p_postid}/>
                            </div>
                            <div className="w-[100%] flex justify-start">
                                <Comments in_commentList={post.comments || []} postid={post.p_postid} username={post.p_username}/>
                            </div>
                        </div>
                    </div>
                ))
                }
            </div>
            <div className="w-[20%] bg-red-100">

            </div>
        </div> 
    );
}    

export default Home;