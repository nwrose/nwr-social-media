"use client"

import { useCallback, useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { type User } from '@supabase/supabase-js';
import Sidebar from '@/app/components/UI/Sidebar';
import Usercard from '@/app/components/Users/Usercard';
import Rightbar from '../components/UI/Rightbar';


interface ExploreProps {
    user: User | null;
    username: string;
}

const ExploreUsers:React.FC<ExploreProps> = ({username, user}) => {
    const [exploreList, setExploreList] = useState<{ username: string; filename: string; uuid: string }[]>([]);

    // ensure a proper user is using this component
    if(!user){
        redirect('/accounts/login');
    }
    const supabase = createClient();

    /*
    Handle Data Load for all profiles to appear in Explore
    */
   const loadProfiles = useCallback(async () => {
    try{
        // use explore list func to get users I have not yet followed
        const {data, error, status} = await supabase.rpc("get_explore", { in_uuid: user.id });
        if(error && status !== 406){
            console.log("error during explore query:", error);
            throw(error);
        }

        // Assuming data is fetched and available --> get users not yet following
        const notFollowingList:{
            username: string;
            filename: string;
            uuid: string;
        }[] = data || [];

        // Update the state with the list
        setExploreList(notFollowingList);
    }
    catch(error){
        console.log(error);
        alert(error);
    }
    finally{
    }
   }, [user, supabase]);

   // run loadProfiles if user or loadProfiles changes (and once on first load)
   useEffect(() => {
    loadProfiles();
   }, [user, loadProfiles]);


    return (
    <>
        <div className="min-h-screen flex flex-col sm:flex-row w-[100%]">
            <Sidebar username={username}/>
            <div className="flex flex-col w-[100%] sm:w-[60%] bg-gray-50 rounded-lg">
                <div className="p-4 sm:py-6 bg-blue-600 text-white text-lg sm:text-2xl font-bold sticky top-0 z-10">
                    Explore Users
                </div>
                <div className="flex flex-col w-full py-2">
                    {exploreList?.map((newUser) => (
                        <div className='w-full px-4 py-2'>
                            <Usercard
                                username={newUser.username}
                                filename={newUser.filename}
                                currently_following={false}
                                uuid={newUser.uuid}
                                key={newUser.username}
                                isSelf={username === newUser.username}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <Rightbar>
                <div></div>
            </Rightbar>
        </div>
    </>
    )
}
export default ExploreUsers;