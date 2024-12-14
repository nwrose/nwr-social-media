"use client"

import { useCallback, useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { type User } from '@supabase/supabase-js';
import { Sidebar } from '@/app/components'
import Image from 'next/image';
import Link from 'next/link';


interface ExploreProps {
    handleFollow: (formData: FormData) => Promise<boolean>;
    user: User | null;
    username: string;
}

const Explore:React.FC<ExploreProps> = ({username, user, handleFollow}) => {
    const [reload, setReload] = useState(0);
    const [loading, setLoading] = useState(false);
    const [exploreList, setExploreList] = useState<{ username: string; filename: string }[]>([]);

    // ensure a proper user is using this component
    if(!user){
        redirect('/accounts/login');
    }
    const supabase = createClient();

    /*
    Handle Follow Action on the page
    */
    const clientHandleFollow = async (formData: FormData) =>{
        if(loading){
            alert("Double click? ignoring extra request");
            return;
        } 
        setLoading(true); // TODO: Localize loading behavior to individual accounts

        // update page client side without full page reload / requerying DB
        const success = await handleFollow(formData);
        if(success){
            const username = formData.get('username') as string;
            setExploreList(exploreList.filter(function (newUser){return newUser.username !== username}));
        }

        setLoading(false);
    }

    /*
    Handle Data Load for all profiles to appear in Explore
    */
   const loadProfiles = useCallback(async () => {
    try{
        setLoading(true);

        // use explore list rpc to get users I have not yet followed
        const {data, error, status} = await supabase.rpc("get_explore", { in_uuid: user.id });
        if(error && status !== 406){
            console.log("error during explore query:", error);
            throw(error);
        }

        // Assuming data is fetched and available --> get users not yet following
        const notFollowingList = data.map((user: { username: string; filename: string }) => ({
            username: user.username,
            filename: user.filename,
        }));

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
                            <div key={newUser.username} className='w-[40%] shadow-xl p-1 my-5 bg-white-'>
                                <form className='flex justify-between items-center w-[100%]'>
                                    <Link href={`/users/${newUser.username}`} className='flex items-center'>
                                        <div>
                                            <Image src={`/pfps/${newUser.filename}`} alt={`${newUser.username}'s pfp`} width={50} height={50} className='rounded-full'/>
                                        </div>
                                        <div className='text-3xl font-bold px-4'>
                                            <p>{newUser.username}</p>
                                        </div>
                                    </Link>
                                    <div className='px-4'>
                                        <input type='hidden' value={newUser.username} name='username'></input>
                                        <button disabled={loading} formAction={clientHandleFollow}>Follow</button>
                                    </div>
                                </form>
                            </div>
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




// query:
    /*  
        SELECT u.username, u.filename FROM users AS u
        WHERE u.username NOT IN (
            SELECT f.username FROM following AS f
            WHERE f.uuid = {user?.id}
        )
    */