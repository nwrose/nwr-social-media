import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import Sidebar from '@/app/components/UI/Sidebar';
import Rightbar from '@/app/components/UI/Rightbar';
import Usercard from '@/app/components/Users/Usercard';
import { redirect } from 'next/navigation';

export default async function ShowMembers({ params }: { params: { fam_id: string }}){
    const supabase = await createClient();
    const { data: {user} } = await supabase.auth.getUser();
    if(!user){
        redirect('/accounts/login');
    }

    const { data: user_data, error:user_error, status:user_status } = await supabase.from("users").select("username").eq("uuid", user.id).single();
    if(user_error && user_status !== 406){
        console.log("error fetching user from fams/[fam_id]/members", user_error);
        redirect('/error');
    }
    const username: string = user_data?.username;

    const {data, error, status } = await supabase.rpc("get_members", {in_fam_id: Number(params.fam_id), in_uuid: user.id});
    if(error && status !== 406){
        console.log("error fetching members", error);
        redirect('/error');
    }
    const members: {
        filename: string,
        username: string,
        uuid: string,
        currently_following: boolean
    }[] = data;

    return (
    <div className="flex flex-col sm:flex-row w-[100%] min-h-screen">
        <Sidebar username={username} />
        <div className="flex flex-col w-[100%] sm:w-[60%] bg-gray-50 rounded-lg">
            <div className="p-4 sm:py-6 bg-blue-600 text-white text-lg sm:text-2xl font-bold sticky top-0 z-10 w-full">
                <div className="h-full w-full flex justify-between">
                    <span className="h-full p-2 flex justify-center items-center">
                        Family Members
                    </span>
                    <span className="h-full flex justify-center items-center">
                        <Link href={`/fams/${params.fam_id}`} className="hover:bg-blue-500 p-2 hover:text-blue-100 rounded">
                            ◀ Back
                        </Link>
                    </span>
                </div>
            </div>
            <div className="flex flex-col w-full py-2">
                {members?.map((member) => (
                    <div className="w-full px-4 py-2">
                        <Usercard
                            username={member.username}
                            filename={member.filename}
                            currently_following={member.currently_following}
                            uuid={member.uuid}
                            key={member.username}
                            isSelf={username === member.username}
                        />
                    </div>
                ))}
            </div>
        </div>
        <Rightbar>
            <div className="flex flex-col items-center p-1 hidden">
                <Link href={`/fams/${params.fam_id}`}>
                    <button className="py-2 px-4 bg-blue-600 text-white font-bold text-sm md:text-base rounded-lg shadow hover:bg-blue-500 hover:shadow-md transition ease-in-out">
                        <p>
                            Return to Family Feed
                        </p>
                    </button>
                </Link>
            </div>
        </Rightbar>
    </div>
    )
}