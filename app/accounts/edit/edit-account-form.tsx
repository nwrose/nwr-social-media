'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { type User } from '@supabase/supabase-js'
import Image from 'next/image';

// ...

export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [fullname, setFullname] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [bio, setBio] = useState<string | null>(null);

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
        setFullname(data.fullname); // # TODO: Match with my DB columns
        setUsername(data.username);
        setFilename(data.filename);
        setEmail(data.email);
        setBio(data.bio);
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

      const { error } = await supabase.from('users').upsert({
        id: user?.id as string,
        fullname: fullname,
        username: username,
        bio: bio,
      })
      if (error) throw error
      alert('Profile updated!');
    } catch (error) {
      alert('Error updating the data!');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
        {/*  -- COMMENTS --
        <div>
            <label htmlFor="email">Email</label>
            <input id="email" type="text" value={user?.email} disabled/>
        </div>
        */}

      <div>
        <div>
          <h1>{username}</h1>
        </div>

        <div>
          <Image src={`/pfps/${filename}`} width={500} height={500} alt="Loading..." decoding='async'/>
        </div>

        <div>
          <div>
            <h4> Name </h4>
            <p>{fullname}</p>
          </div>

          <div>
            <h4> Email </h4>
            <p>{email}</p>
          </div>
          
          <div>
            <h4>Bio</h4>
            <p>{bio}</p>
          </div>
        </div>
      </div>

      <div>
        <div>
          <label htmlFor="fullName">Full Name</label>
          <input id="fullName" type="text" value={fullname || ''} onChange={(e) => setFullname(e.target.value)}/>
        </div>

        <div>
          <label htmlFor="username">Username</label>
          <input id="username" type="text" value={username || ''} onChange={(e) => setUsername(e.target.value)}/>
        </div>

        <div>
          <label htmlFor="bio">Bio</label>
          <input id="bio" type="text" value={bio || ''} onChange={(e) => setBio(e.target.value)}/>
        </div>

        <div>
          <button onClick={() => updateProfile({ username, fullname, bio })} disabled={loading} >
            {loading ? 'Loading ...' : 'Update'}
          </button>
        </div>

        <div>
          <form action="/auth/signout" method="post">
            <button type="submit">
              Sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}