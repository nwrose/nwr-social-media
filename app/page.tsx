import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Sidebar, Post } from "@/app/components";

export default async function Home(){
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/accounts/login/');
    }

    const { data, error, status } = await supabase.from('users').select('username').eq('uuid', user.id).single();
    if (error && status !== 406) {
        console.log("Index page error fetching user DB info:", error);
        redirect('/error');
    }

    const username: string = data?.username;
    let posts: {
        p_postid: number,
        p_created: string,
        p_filename: string,
        p_username: string,
        p_pfp_filename: string,
        comments: Array<{ commentid: number; text: string; created: string; username: string; }>;
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
        <div className="flex w-full min-h-screen bg-gray-100">
            <Sidebar username={username} />
            <div className="w-[60%] flex flex-col bg-white shadow-md">
                <div className="p-4 bg-blue-600 text-white text-lg font-bold sticky top-0 z-10">
                    Main Feed
                </div>
                <div className="flex flex-col items-center space-y-6 p-6">
                    {posts.map((post) => (
                        <div key={post.p_postid} className="w-full max-w-3xl bg-gray-50 p-4 rounded-lg      ">
                            <Post
                                my_username={username}
                                postid={post.p_postid.toString()}
                                likeCount={post.likes?.length || 0}
                                isLiked={post.likes?.findIndex((like) => like.username === username) >= 0}
                                post_data={{
                                post_filename: post.p_filename,
                                created: post.p_created,
                                username: post.p_username,
                                pfp_filename: post.p_pfp_filename,
                                comments: post.comments,
                                likes: post.likes
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-[20%] bg-gray-50 hidden md:block shadow-lg">
                <div className="w-[20%]">
                </div>
                <div className="flex flex-col space-y-5 w-[20%] fixed h-screen p-4">
                </div>
            </div>
        </div>
    );
}