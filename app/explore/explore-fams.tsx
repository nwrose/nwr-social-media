"use client"

import { useCallback, useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { type User } from '@supabase/supabase-js';
import Sidebar from '@/app/components/UI/Sidebar';
import Usercard from '@/app/components/Users/Usercard';


interface ExploreProps {
    user: User | null;
    username: string;
}

const ExploreFams:React.FC<ExploreProps> = ({username, user}) => {
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
            <div className="flex flex-col items-center w-[100%] sm:w-[60%] bg-gray-50 py-10 px-4 rounded-lg">
                <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-700 mb-6">
                    Explore
                </h2>
                <div className="flex flex-col gap-6 w-full">
                    {exploreList?.map((newUser) => (
                    <Usercard
                        username={newUser.username}
                        filename={newUser.filename}
                        currently_following={false}
                        uuid={newUser.uuid}
                        key={newUser.username}
                        isSelf={username === newUser.username}
                    />
                    ))}
                </div>
            </div>


            <div className='w-[20%] bg-white shadow-lg hidden sm:block'>
                
            </div>
        </div>
    </>
    )
}
export default ExploreFams;