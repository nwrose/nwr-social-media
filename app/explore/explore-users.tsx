"use client"

import { useCallback, useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { type User } from '@supabase/supabase-js';
import { Sidebar, Usercard } from '@/app/components'
import Image from 'next/image';
import Link from 'next/link';


interface ExploreProps {
    user: User | null;
    username: string;
}

const Explore:React.FC<ExploreProps> = ({username, user}) => {
    const [reload, setReload] = useState(0);
    const [loading, setLoading] = useState(false);
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
        setLoading(true);

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
        setLoading(false);
    }
   }, [user, supabase]);

   // run loadProfiles if user or loadProfiles changes (and once on first load)
   useEffect(() => {
    loadProfiles();
   }, [user, loadProfiles]);


    return (
    <>
        <div className="h-screen flex w-[100%]">
            <Sidebar username={username}/>
            <div className='flex-col items-center w-[60%] bg-green-100'>
                <h2 className="flex items-center justify-center py-10 text-6xl font-bold"> 
                    Explore 
                </h2>
                <div className="flex flex-col justify-start py-10 items-center w-[100%]">
                    {   
                        exploreList?.map((newUser) => (
                                <Usercard 
                                    username={newUser.username} 
                                    filename={newUser.filename} 
                                    currently_following={false} 
                                    uuid={newUser.uuid}
                                    key={newUser.username}
                                    isSelf={username === newUser.username}
                                />
                        ))
                    }
                </div>
            </div>
            <div className='w-[20%] bg-green-200'>
                
            </div>
        </div>
    </>
    )
}
export default Explore;