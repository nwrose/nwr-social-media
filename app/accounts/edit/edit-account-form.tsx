'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { type User } from '@supabase/supabase-js'
import Image from 'next/image';

// ...

export default function AccountForm({ user }: { user: User | null }) {
  const [loading, setLoading] = useState(true);
  const [fullname, setFullname] = useState<string | null>(null);
  const [displayFullname, setDisplayFullname] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [displayUsername, setDisplayUsername] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [bio, setBio] = useState<string | null>(null);
  const [displayBio, setDisplayBio] = useState<string | null>(null);

  const supabase = createClient();

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error, status } = await supabase
        .from('users')
        .select(`username, email, fullname, filename, bio`)
        .eq('uuid', user?.id)
        .single();

      if (error && status !== 406) {
        console.log(error);
        throw error;
      }

      if (data) {
        setFilename(data.filename);
        setEmail(data.email);
        setDisplayFullname(data.fullname);
        setDisplayUsername(data.username);
        setDisplayBio(data.bio);
        setFullname('');
        setUsername('');
        setBio('');
      }
    } catch (error) {
      alert('Error loading user data!');
    } finally {
      setLoading(false);
    };
  }, [user, supabase]);

  useEffect(() => {
    getProfile()
  }, [user, getProfile]);

  async function updateProfile(
    { username, fullname, bio,}: {
    username: string | null 
    fullname: string | null
    bio: string | null }) 
    {
    try {
      setLoading(true);

      const { error } = await supabase.from('users').update({ fullname: fullname, username: username, bio: bio }).eq('email', user?.email).select();

      if (error){
        throw error;
      }
      setDisplayFullname(fullname);
      setDisplayUsername(username);
      setDisplayBio(bio);
      setFullname('');
      setUsername('');
      setBio('');
      alert('Profile updated!'); // # TODO: Remove?
    } 
    catch (error) {
      alert('Error updating the data!');
      console.log(error);
    } 
    finally {
      setLoading(false);
    }
  }

  return (
    <div className='w-[80%] flex'>
      <div className='w-[50%] flex flex-col items-center'>
        <div>
          <Image src={`/pfps/${filename}`} width={200} height={200} alt="Loading..." decoding='async' className='rounded-full'/>
        </div>
        <div className='text-2xl my-2'>
          <h1>{displayUsername}</h1>
        </div>
        <div className='my-4 space-y-4 w-[75%] flex flex-col'>
          <div>
            <h4> Name: </h4>
            <p>{displayFullname}</p>
          </div>
          <div>
            <h4> Email: </h4>
            <p>{email}</p>
          </div>
          <div>
            <h4>Bio:</h4>
            <p>{displayBio}</p>
          </div>
        </div>
      </div>

      <div className='text-gray-600 w-[50%] flex flex-col items-center space-y-4 bg-green-100 justify-around'>
        <div className='space-y-2 w-[75%] flex flex-col pb-4'>
          <h1 className='w-[100%] flex justify-center pb-4 text-2xl'>
            Update Account Info
          </h1>
          <div className='flex flex-col items-center pb-4'>
            <label htmlFor="fullName">Full Name</label>
            <input id="fullName" type="text" value={fullname || ''} onChange={(e) => setFullname(e.target.value)}/>
          </div>

          <div className='flex flex-col items-center pb-4'>
            <label htmlFor="username">Username</label>
            <input id="username" type="text" value={username || ''} onChange={(e) => setUsername(e.target.value)}/>
          </div>

          <div className='flex flex-col items-center'>
            <label htmlFor="bio">Bio</label>
            <textarea id="bio" value={bio || ''} onChange={(e) => setBio(e.target.value)} className="w-[100%] p-2 rounded-lg overflow-hidden resize-none"/>
          </div>

          <div className='w-[100%] flex justify-center items-center text-2xl'>
            <button onClick={() => updateProfile({ username, fullname, bio })} disabled={loading} className='rounded hover:bg-green-300 p-1'>
              {loading ? 'Loading ...' : 'Update'}
            </button>
          </div>
        </div>

        <div>
          <form action="/auth/signout" method="post">
            <button type="submit" className='bg-red-300 border-2 border-black rounded p-1'>
              Sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}