'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { type User } from '@supabase/supabase-js';
import { handleSignout } from '@/app/actions';
import Image from 'next/image';

// Reusable Modal Component
function Modal({
  message,
  onCancel,
  onConfirm,
  loading,
}: {
  message: string | React.ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md">
        <div className="mb-6 text-center">{message}</div>
        <div className="flex justify-between">
          <button
            onClick={onCancel}
            className="bg-gray-200 px-4 py-2 rounded shadow hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={onConfirm}
            className={`px-4 py-2 rounded shadow text-white ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            {loading ? 'Processing...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AccountForm({ user }: { user: User | null }) {
  const [loading, setLoading] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [fullname, setFullname] = useState<string | null>('');
  const [username, setUsername] = useState<string | null>('');
  const [bio, setBio] = useState<string | null>('');
  const [filename, setFilename] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [displayFullname, setDisplayFullname] = useState<string | null>(null);
  const [displayUsername, setDisplayUsername] = useState<string | null>(null);
  const [displayBio, setDisplayBio] = useState<string | null>(null);

  const supabase = createClient();

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select(`username, email, fullname, filename, bio`)
        .eq('uuid', user?.id)
        .single();

      if (error) throw error;

      if (data) {
        setFilename(data.filename);
        setEmail(data.email);
        setDisplayFullname(data.fullname);
        setDisplayUsername(data.username);
        setDisplayBio(data.bio);
      }
    } catch (error) {
      alert('Error loading user data!');
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  const updateProfile = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('users')
        .update({ fullname, username, bio })
        .eq('uuid', user?.id);

      if (error) throw error;

      setDisplayFullname(fullname);
      setDisplayUsername(username);
      setDisplayBio(bio);
      setShowProfileModal(false);
    } catch (error) {
      alert('Error updating the profile!');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setShowSignOutModal(false);
    // Perform the sign-out logic here.
    handleSignout();
  };

  return (
    <div className="w-[80%] mx-auto flex flex-wrap">
      {/* User Information Display */}
      <div className="w-full lg:w-[50%] flex flex-col items-center">
        <div className="rounded-full border-4 border-blue-400 m-2 overflow-hidden w-64 h-64 relative">
          <Image
            src={`/pfps/${filename || 'default.png'}`}
            fill
            alt="Profile Picture"
            className="object-cover rounded-full"
          />
        </div>
        <h1 className="text-2xl my-2">{displayUsername || 'Anonymous'}</h1>
        <div className="my-4 space-y-4 w-[75%] flex flex-col">
          <div>
            <h4 className="font-bold">Name:</h4>
            <p>{displayFullname || 'N/A'}</p>
          </div>
          <div>
            <h4 className="font-bold">Email:</h4>
            <p>{email || 'N/A'}</p>
          </div>
          <div>
            <h4 className="font-bold">Bio:</h4>
            <p>{displayBio || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Update Form */}
      <div className="w-full lg:w-[50%] bg-green-100 flex flex-col items-center space-y-4 p-6">
        <h1 className="text-2xl font-bold">Update Account Info</h1>
        <div className="w-[75%] space-y-4">
          <div className="flex flex-col">
            <label htmlFor="fullname" className="font-bold">
              Full Name
            </label>
            <input
              id="fullname"
              type="text"
              value={fullname || ''}
              onChange={(e) => setFullname(e.target.value)}
              className="p-2 rounded border"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="username" className="font-bold">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username || ''}
              onChange={(e) => setUsername(e.target.value)}
              className="p-2 rounded border"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="bio" className="font-bold">
              Bio
            </label>
            <textarea
              id="bio"
              value={bio || ''}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-2 rounded border resize-none"
              rows={4}
            />
          </div>
          <button
            onClick={() => setShowProfileModal(true)}
            disabled={loading}
            className="w-full bg-green-300 p-2 rounded font-bold hover:bg-green-400 disabled:opacity-50"
          >
            Update
          </button>
        </div>
        <button
          onClick={() => setShowSignOutModal(true)}
          className="bg-red-300 rounded p-2 font-bold hover:bg-red-400"
        >
          Sign Out
        </button>
      </div>

      {/* Profile Update Modal */}
      {showProfileModal && (
        <Modal
          message={
            <div className="space-y-2">
              <p className="font-bold text-lg">Confirm the following changes:</p>
              <p><strong>Full Name:</strong> {fullname}</p>
              <p><strong>Username:</strong> {username}</p>
              <p><strong>Bio:</strong> {bio}</p>
            </div>
          }
          onCancel={() => setShowProfileModal(false)}
          onConfirm={updateProfile}
          loading={loading}
        />
      )}

      {/* Sign-Out Confirmation Modal */}
      {showSignOutModal && (
        <Modal
          message="Are you sure you want to sign out?"
          onCancel={() => setShowSignOutModal(false)}
          onConfirm={signOut}
          loading={false}
        />
      )}
    </div>
  );
}
