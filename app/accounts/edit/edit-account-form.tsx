'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Modal } from '@/app/components';
import { type User } from '@supabase/supabase-js';
import { handleSignout, verifyUsername } from '@/app/actions';
import { CldImage } from '@/app/components';
import { motion } from "framer-motion";



export default function AccountForm({ user }: { user: User | null }) {
	// loading and modals
	const [loading, setLoading] = useState(false);
	const [showProfileModal, setShowProfileModal] = useState(false);
	const [showSignOutModal, setShowSignOutModal] = useState(false);

	// field inputs
	const [fullname, setFullname] = useState<string | null>('');
	const [username, setUsername] = useState<string | null>('');
	const [bio, setBio] = useState<string | null>('');
	const [verifyMsg, setVerifyMsg] = useState<"GOOD" | "SHORT" | "SPACE" | "TAKEN">("GOOD");

	// display values for account
	const [filename, setFilename] = useState<string>("");
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

			setFullname(data.fullname);
			setUsername(data.username);
			setBio(data.bio);
		}
		} catch (error) {
			alert(error);
		} finally {
			setLoading(false);
		}
	}, [user, supabase]);

	useEffect(() => {
		getProfile();
	}, [getProfile]);

	const updateProfile = async () => {
		setLoading(true);
		// Verify username
		const result = await verifyUsername(username);
		if(result === "SHORT" || result === "SPACE" || result === "TAKEN"){
			setVerifyMsg(result);
		}
		else{	
			// update the profile
			const { error } = await supabase
				.from('users')
				.update({ fullname, username, bio })
				.eq('uuid', user?.id);
			if (error){
				alert("error with edit-account-form submission.\n              CHECK LOGS                  ");
				console.log('error with edit-account-form submission', error);
			}

			setDisplayFullname(fullname);
			setDisplayUsername(username);
			setDisplayBio(bio);
		}
		setShowProfileModal(false);
		setLoading(false);
	};

	const signOut = async () => {
		setShowSignOutModal(false);
		handleSignout();
	};

	return (
		<div className="max-w-5xl mx-auto bg-gray-50 w-full">
			<div className="flex justify-around items-center w-full h-screen">
				<div className="flex flex-col items-center justify-between bg-white shadow-lg w-[45%] h-5/6 min-h-[400px] rounded-lg p-6">
					<div className='flex flex-col items-center justify-around space-y-4'>
						<div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-blue-400 shadow-2xl">
							<CldImage
								src={filename}
								fill
								alt="Profile Picture"
								className="object-cover"
							/>
						</div>
						<h1 className="text-2xl font-semibold">{displayUsername || 'Anonymous'}</h1>
						<div className="w-full text-center space-y-2">
							<p className="text-sm"><strong>Name:</strong> {displayFullname || 'N/A'}</p>
							<p className="text-sm"><strong>Email:</strong> {email || 'N/A'}</p>
							<p className="text-sm"><strong>Bio:</strong> {displayBio || 'N/A'}</p>
						</div>
					</div>
					<button
						onClick={() => setShowSignOutModal(true)}
						className="w-full py-2 bg-red-500 text-white rounded shadow-lg hover:bg-red-600 transition"
					>
						Sign Out
					</button>
				</div>

				<div className="flex flex-col justify-between p-6 bg-white rounded-lg shadow-lg space-y-6 w-[45%] h-5/6">
					<div className='space-y-6'>
						<h2 className="text-xl font-semibold text-gray-700"> Update Account Info </h2>
						<div className="space-y-4">
							<div>
								<label htmlFor="fullname" className="block text-sm font-semibold text-gray-600">
									Full Name
								</label>
								<input
									id="fullname"
									type="text"
									value={fullname || ''}
									onChange={(e) => setFullname(e.target.value)}
									className="w-full p-2 mt-1 rounded border shadow-sm focus:ring-2 focus:ring-blue-400"
								/>
							</div>
							<div>
								<label htmlFor="username" className="block text-sm font-semibold text-gray-600">
									Username
								</label>
								<input
									id="username"
									type="text"
									value={username || ''}
									onFocus={() => setVerifyMsg("GOOD")}
									onChange={(e) => setUsername(e.target.value.trim())}
									className={`w-full p-2 mt-1 rounded border shadow-sm focus:ring-2 focus:ring-blue-400 ${verifyMsg === "GOOD" ? "" : "border-red-500" }`}
								/>
								{(verifyMsg === "SHORT") &&
								    <motion.p
										className="text-red-500 text-sm mt-1"
										initial={{ opacity: 0, y: -5 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -5 }}
										transition={{ duration: 0.3, ease: "easeInOut" }}
									>
												Username must be at least 3 characters
									</motion.p>
								}
								{(verifyMsg === "SPACE") &&
									<motion.p
										className="text-red-500 text-sm mt-1"
										initial={{ opacity: 0, y: -5 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -5 }}
										transition={{ duration: 0.3, ease: "easeInOut" }}
									>
										Username must not contain spaces
									</motion.p>
								}
								{(verifyMsg === "TAKEN") &&
								    <motion.p
										className="text-red-500 text-sm mt-1"
										initial={{ opacity: 0, y: -5 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -5 }}
										transition={{ duration: 0.3, ease: "easeInOut" }}
									>
										Username is taken
									</motion.p>
								}
							</div>
							<div>
								<label htmlFor="bio" className="block text-sm font-semibold text-gray-600">
									Bio
								</label>
								<textarea
									id="bio"
									value={bio || ''}
									onChange={(e) => setBio(e.target.value)}
									className="w-full p-2 mt-1 rounded border shadow-sm focus:ring-2 focus:ring-blue-400"
									rows={4}
								/>
							</div>
						</div>
					</div>
					<button
							onClick={() => setShowProfileModal(true)}
							disabled={loading}
							className="w-full py-2 bg-blue-500 text-white rounded shadow-lg hover:bg-blue-600 transition disabled:opacity-50 mb-10"
						>
							Update
					</button>
				</div>
			</div>

			{/* Modals */}
			{showProfileModal && (
				<Modal
				message={
					<div>
					<p className="font-semibold text-lg">Confirm the following changes:</p>
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