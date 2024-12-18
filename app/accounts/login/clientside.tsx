'use client';

import { useState } from 'react';
import { login, signup } from './actions';
import { motion } from "framer-motion";

export default function LoginPage() {
	const [loginFailed, setLoginFailed] = useState(false);
	const [loading, setLoading] = useState(false);

	// Handle signup
	async function handleSignup() {
		setLoading(true);
		await signup();
		setLoading(false);
	}

	// Handle login
	const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault(); 
		setLoading(true);
		setLoginFailed(false);

		const formData = new FormData(event.currentTarget);
		const failure: boolean = await login(formData);

		if (failure) {
			setLoginFailed(true);
		}
		setLoading(false);
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<div className="bg-white shadow-md rounded p-8 w-[90%] max-w-md">
				<h1 className="text-2xl font-bold text-center mb-6">Welcome Back</h1>
				<form className="space-y-4" onSubmit={handleLogin}>
					<div>
						<label htmlFor="email" className="block text-sm font-medium text-gray-700">
							Email
						</label>
						<input
							type="email"
							name="email"
							placeholder="Email"
							className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>
					<div>
						<label htmlFor="password" className="block text-sm font-medium text-gray-700">
							Password
						</label>
						<input
							type="password"
							name="password"
							placeholder="Password"
							className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>
					<div>
						<button
							type="submit"
							className={`w-full text-white py-2 rounded transition ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
							disabled={loading}
						>
							{loading ? (
								<div className="flex justify-center items-center space-x-2">
									<svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										/>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
										/>
									</svg>
									<span>
										Loading...
									</span>
								</div>
							) : (
								"Login"
							)}
						</button>
					</div>
					<div>
						{loginFailed && (
							<motion.p
								className="text-red-500 text-sm mt-1 flex flex-col justify-center items-center"
								initial={{ opacity: 0, y: -5 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -5 }}
								transition={{ duration: 0.3, ease: "easeInOut" }}
							>
								Sorry, we couldn't find an account with those credentials. Please double check your email and password.
							</motion.p>
						)}
					</div>
				</form>
				<div className="text-center mt-4">
					<p className="text-sm text-gray-500">Don't have an account?</p>
					<button onClick={handleSignup} className="text-blue-500 font-semibold hover:underline">
						Sign Up
					</button>
				</div>
			</div>
		</div>
	);
}
