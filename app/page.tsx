import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Sidebar from "@/app/components/UI/Sidebar";
import Post from "@/app/components/Posts/Post";

export default async function Home(){
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/accounts/login/');
    }

    const { data, error, status } = await supabase.from('users').select('username').eq('uuid', user.id).single();
    if (error && status !== 406) {
        console.log("Index page error fetching user DB info:", error);
        redirect('/accounts/login');
    }

    const username: string = data?.username;
    let posts: { 
        p_postid: number,
        p_created: string,
        p_filename: string,
        p_username: string,
        p_pfp_filename: string,
        p_caption: string,
        p_fam_id: number,
        p_fam_name: string,
        comments: Array<{ commentid: number; text: string; created: string; username: string; like_count:number; liked_by_user:boolean }>;
        likes: Array<{ uuid: string; username: string; }>;
    }[];
    {
        const { data, error, status } = await supabase.rpc('get_main_feed', { in_uuid: user.id });
        if (error && status !== 406) {
        console.log("error fetching main feed: ", error);
        redirect('/error');
        }
        posts = data;
    }

    return (
        <div className="flex flex-col sm:flex-row w-full min-h-screen rounded-lg">
            <Sidebar username={username} />
            <div className="w-[100%] sm:w-[60%] flex flex-col bg-white shadow-md">
                <div className="p-4 sm:py-6 bg-blue-600 text-white text-lg sm:text-2xl font-bold sticky top-0 z-10">
                    My Feed
                </div>
                <div className="flex flex-col items-center">
                    {posts.map((post) => (
                        <div key={post.p_postid} className="w-full max-w-3xl bg-gray-50 p-4 pb-10">
                            <Post
                                my_username={username}
                                postid={post.p_postid.toString()}
                                likeCount={post.likes?.length || 0}
                                isLiked={post.likes?.findIndex((like) => like.username === username) >= 0}
                                isFeed={true}
                                post_data={{
                                    post_filename: post.p_filename,
                                    created: post.p_created,
                                    username: post.p_username,
                                    pfp_filename: post.p_pfp_filename,
                                    caption: post.p_caption,
                                    fam_id: post.p_fam_id,
                                    fam_name: post.p_fam_name,
                                    comments: post.comments,
                                    likes: post.likes
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-[20%] bg-gray-50 hidden sm:block shadow-lg">
                <div className="w-[20%]">
                </div>
                <div className="flex flex-col space-y-5 w-[20%] fixed h-screen p-4">
                </div>
            </div>
        </div>
    );
}