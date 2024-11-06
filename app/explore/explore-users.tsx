"use client"

import { useCallback, useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { type User } from '@supabase/supabase-js';
import Image from 'next/image';

interface ExploreProps {
    handleFollow: (formData: FormData) => Promise<boolean>;
    user: User | null;
}

const Explore:React.FC<ExploreProps> = ({user, handleFollow}) => {
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

        // get all users current user follows
        const {data:followingUsernames, error:followingError} = await supabase
            .from('following')
            .select('username')
            .eq('uuid', user.id);
        if(followingError){
            console.log("error fetching list of users current user follows:", followingError);
            throw(followingError);
        }

        // put list into string format for DB query
        let followingList:Array<String>; 
        let followingString:String;
        if(followingUsernames.length ==0 ){
            followingList = [];
            followingString = "()";
        } 
        else{
            followingList = followingUsernames.map(f => f.username as string); // either the list or empty array
            followingString = '(';
            for(let i = 0; i < followingList.length - 1; ++i){
                followingString += followingList[i] + ', ';
            }
            followingString += followingList[followingList.length - 1] + ')';
        }

        // get all users not in this list from DB
        const {data, error, status} = followingString === "()"
        ? await supabase.from('users').select('username, filename').neq('uuid', user.id)
        : await supabase.from('users').select('username, filename').not('username', 'in', followingString).neq('uuid', user.id);
        if(error){
            console.log('error with explore query:', error);
            throw(followingError);
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
        <div className="h-screen flex flex-col items-center w-screen">
            <h2 className="py-10 text-6xl font-bold"> 
                Explore 
            </h2>
            <div className="flex flex-col justify-around items-center w-[100%]">
                {   
                    exploreList?.map((newUser) => (
                        <div key={newUser.username} className='w-[30%] shadow-xl'>
                            <form className='flex justify-between items-center px-4 w-[100%]'>
                                <div className='flex items-center'>
                                    <div>
                                        <Image src={`/pfps/${newUser.filename}`} alt={`${newUser.username}'s pfp`} width={50} height={50} className='rounded-full'/>
                                    </div>
                                    <div className='text-3xl font-bold px-4'>
                                        <p>{newUser.username}</p>
                                    </div>
                                </div>
                                <div>
                                    <input type='hidden' value={newUser.username} name='username'></input>
                                    <button disabled={loading} formAction={clientHandleFollow}>Follow</button>
                                </div>
                            </form>
                        </div>
                    ))
                }
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