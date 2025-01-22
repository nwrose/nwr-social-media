"use client";

import React, { useRef, useState } from "react";
import { validateEmailUser } from "./serverside";
import { motion } from "framer-motion";
import { CldImage, CldUploadButtonClient } from "@/app/components";
import { CldUploadButton } from "next-cloudinary";

interface CreateAccountProps {
handleSubmit: (formData: FormData) => Promise<void>;
}

const CreateClientside: React.FC<CreateAccountProps> = ({ handleSubmit }) => {
// use for live-updated clientside password validation
const letterRef = useRef<HTMLLIElement>(null);
const capitalRef = useRef<HTMLLIElement>(null);
const numberRef = useRef<HTMLLIElement>(null);
const lengthRef = useRef<HTMLLIElement>(null);
const matchRef = useRef<HTMLLIElement>(null);
const msgRef = useRef<HTMLDivElement>(null);
const confirmMsgRef = useRef<HTMLDivElement>(null);

const [loading, setLoading] = useState(false);
const [pfpUploaded, setPfpUploaded] = useState(false);

// clientside password validation
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [lowerCheck, setLowerCheck] = useState(false);
const [upperCheck, setUpperCheck] = useState(false);
const [numberCheck, setNumberCheck] = useState(false);
const [lengthCheck, setLengthCheck] = useState(false);

// clientside email and username validation
const [email, setEmail] = useState("");
const [username, setUsername] = useState("");
const [emailTaken, setEmailTaken] = useState(false);
const [usernameValid, setUsernameValid] = useState<"GOOD" | "SHORT" | "SPACE" | "TAKEN">("GOOD")


const updateValidationState = (ref: React.RefObject<HTMLLIElement>, isValid: boolean) => {
    if (ref.current) {
        const iconSpan = ref.current.querySelector("span");
        if (isValid) {
        if (iconSpan) iconSpan.textContent = "✔️"; // Update to check mark
        return true;
        } else {
        if (iconSpan) iconSpan.textContent = "❌"; // Update to red X
        return false;
        }
    }
    return false;
};

// Handle password validation and state
const handlePasswordFocus = () => {
    msgRef.current?.classList.add("visible", "opacity-100", "translate-y-0");
    msgRef.current?.classList.remove("invisible", "opacity-0", "-translate-y-5");
};
const handlePasswordBlur = () => {
    msgRef.current?.classList.add("invisible", "opacity-0", "-translate-y-5");
    msgRef.current?.classList.remove("visible", "opacity-100", "translate-y-0");
};
const handlePasswordValidation = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);

    const lowerCaseLetters = /[a-z]/g;
    const upperCaseLetters = /[A-Z]/g;
    const numbers = /[0-9]/g;

    // Validate lowercase letter, uppercase letter, number, and length
    setLowerCheck(updateValidationState(letterRef, event.target.value.match(lowerCaseLetters) !== null));
    setUpperCheck(updateValidationState(capitalRef, event.target.value.match(upperCaseLetters) !== null));
    setNumberCheck(updateValidationState(numberRef, event.target.value.match(numbers) !== null));
    setLengthCheck(updateValidationState(lengthRef, event.target.value.length >= 8));
};


// Handle the confirm password input
const handleConfirmPasswordValidaton = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value);
    updateValidationState(matchRef, event.target.value === password);
};
const handleConfirmPasswordFocus = () => {
    confirmMsgRef.current?.classList.add("visible", "opacity-100", "translate-y-0");
    confirmMsgRef.current?.classList.remove("invisible", "opacity-0", "-translate-y-5");
};
const handleConfirmPasswordBlur = () => {
    confirmMsgRef.current?.classList.add("invisible", "opacity-0", "-translate-y-5");
    confirmMsgRef.current?.classList.remove("visible", "opacity-100", "translate-y-0");
};


const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    
    // ensure username and email are valid before submitting to server
    const result: { email_available: boolean, username_status: "GOOD" | "SHORT" | "SPACE" | "TAKEN"} = await validateEmailUser(email, username);
    
    if(!(result.email_available && result.username_status === "GOOD")){
        setUsernameValid(result.username_status);
        if(!result.email_available) setEmailTaken(true);

        setLoading(false);
        return;
    }
    await handleSubmit(formData);
    setLoading(false);
};

const handlePfpSuccess = (result: any) => {
    const form = document.getElementById("create-form") as HTMLFormElement;
    const filenameField = form.querySelector("#pfp-filename") as HTMLInputElement;

    if(filenameField){
        filenameField.value = result.info.public_id;
        setPfpUploaded(true);
    }
    else{
        alert("failed to locate filename field on image upload");
    }
}

return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="bg-white shadow-md rounded p-8 w-[90%] max-w-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>
        <p className="text-center text-sm text-gray-600 mb-4">
        Already have an account?{" "}
        <a href="/accounts/login/" className="text-blue-500 hover:underline">
            Sign in
        </a>
        </p>
        <form onSubmit={handleFormSubmit} className="space-y-4 text-gray-600 relative" id="create-form">
        <div>
            <label htmlFor="name" className="block text-sm font-medium">
                Full Name
            </label>
            <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            required
            />
        </div>
        <div>
            <label htmlFor="username" className="block text-sm font-medium">
                Username
            </label>
            <input
            type="text"
            name="username"
            id="username"
            placeholder="Username"
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 ${(usernameValid === "GOOD") ? "" : "border-red-500"}`}
            value={username}
            onChange={(e) => setUsername(e.target.value.trim())}
            onFocus={() => setUsernameValid("GOOD")}
            required
            />
            {usernameValid === "SHORT" && 
                <motion.p
                    className="text-red-500 text-sm mt-1"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    Username must contain at least 3 characters
                </motion.p>
            }
            {usernameValid === "SPACE" && 
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
            {usernameValid === "TAKEN" && 
                <motion.p
                    className="text-red-500 text-sm mt-1"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    Username is taken. Please choose another username
                </motion.p>
            }
        </div>
        <div>
            <label htmlFor="pfp-filename" className="block text-sm font-medium">
                Profile Picture {pfpUploaded && "✅"}
            </label>
            <input
            type="hidden"
            name="pfp-filename"
            id="pfp-filename"
            required
            />
            {!pfpUploaded ? (
                <CldUploadButton uploadPreset="posts_and_pfps" onSuccess={handlePfpSuccess} className="w-full">
                    <div className={`w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition`}>
                        Upload Profile Picture
                    </div>
                </CldUploadButton>
            ) : (
                <div className={`w-full text-white py-2 rounded bg-blue-300 cursor-default text-center`}>
                    Upload Profile Picture
                </div>
            )}
        </div>
        <div>
            <label htmlFor="email" className="block text-sm font-medium">
                Email
            </label>
            <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500$ ${emailTaken ? "border-red-500" : ""}`}
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
                onFocus={() => setEmailTaken(false)}
                required
            />
            {emailTaken && (
                <motion.p
                    className="text-red-500 text-sm mt-1"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    Email is already in use. Please use another one or&nbsp;
                    <a href="/accounts/login/" className="text-blue-500 hover:underline">
                        sign in
                    </a>
                </motion.p>
            )}
        </div>
        <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium">
            Password
            </label>
            <input
            type="password"
            name="password"
            placeholder="Password"
            onFocus={handlePasswordFocus}
            onBlur={handlePasswordBlur}
            onChange={handlePasswordValidation}
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
            title="Must contain at least one number, one uppercase, one lowercase letter, and at least 8 characters."
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            required
            />
            <div ref={msgRef} className="absolute -top-[160px] left-0 w-full bg-gray-100 p-3 rounded shadow-lg border border-gray-300 invisible opacity-0 transition-all duration-300 -translate-y-5">
                <h3 className="text-sm font-medium mb-2">Password must contain:</h3>
                <ul className="space-y-1 text-sm">
                    <li ref={letterRef} className="flex items-center">
                        <span className="mr-2">❌</span> A lowercase letter
                    </li>
                    <li ref={capitalRef} className="flex items-center">
                        <span className="mr-2">❌</span>A capital (uppercase) letter
                    </li>
                    <li ref={numberRef} className="flex items-center">
                        <span className="mr-2">❌</span>A number
                    </li>
                    <li ref={lengthRef} className="flex items-center">
                        <span className="mr-2">❌</span>Minimum  8 characters
                    </li>
                </ul>
            </div>
        </div>
        <div className="relative">
            <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium"
            >
            Confirm Password
            </label>
            <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onFocus={handleConfirmPasswordFocus}
            onBlur={handleConfirmPasswordBlur}
            onChange={handleConfirmPasswordValidaton}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            required
            />
            <div ref={confirmMsgRef} className="absolute -top-[60px] left-0 w-full bg-gray-100 p-3 rounded shadow-lg border border-gray-300 invisible opacity-0 transition-all duration-300 -translate-y-5">
                <ul className="space-y-1 text-sm">
                    <li ref={matchRef} className="flex items-center">
                        <span className="mr-2">❌</span> Passwords must match
                    </li>
                </ul>
            </div>
        </div>
        <button
            type="submit"
            className={`w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition disabled:bg-blue-300 disabled:cursor-not-allowed`}
            disabled={!(lowerCheck && upperCheck && numberCheck && lengthCheck && (password === confirmPassword) && !loading && !emailTaken && usernameValid === "GOOD")}
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
                "Sign Up"
            )}
        </button>
        </form>
    </div>
    </div>
);
};

export default CreateClientside;
