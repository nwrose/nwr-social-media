"use client"

import React, { useRef } from "react";

interface CreateAccountProps {
    handleSubmit: (formData: FormData) => Promise<void>;
}

const CreateClientside: React.FC<CreateAccountProps> = ({ handleSubmit }) => {
    const letterRef = useRef<HTMLDivElement>(null);
    const capitalRef = useRef<HTMLDivElement>(null);
    const numberRef = useRef<HTMLDivElement>(null);
    const lengthRef = useRef<HTMLDivElement>(null);
    const msgRef = useRef<HTMLDivElement>(null);

    const handlePasswordFocus = () => {
        msgRef.current?.classList.add("block");
        msgRef.current?.classList.remove("hidden");
    }

    const handlePasswordBlur = () => {
        msgRef.current?.classList.remove("block");
        msgRef.current?.classList.add("hidden");
    }
    
    const handlePasswordValidation = (event:React.ChangeEvent<HTMLInputElement>) => {
        // Validate lowercase letters
        var lowerCaseLetters = /[a-z]/g;
        if(event.target.value.match(lowerCaseLetters)) {
            letterRef.current?.classList.remove("invalid"); // Note: the ? after 'current' says only execute if object not null
            letterRef.current?.classList.add("valid");
        } else {
            letterRef.current?.classList.remove("valid");
            letterRef.current?.classList.add("invalid");
        }

        // Validate capital letters
        var upperCaseLetters = /[A-Z]/g;
        if(event.target.value.match(upperCaseLetters)) {
            capitalRef.current?.classList.remove("invalid");
            capitalRef.current?.classList.add("valid");
        } else {
            capitalRef.current?.classList.remove("valid");
            capitalRef.current?.classList.add("invalid");
        }

        // Validate numbers
        var numbers = /[0-9]/g;
        if(event.target.value.match(numbers)) {
            numberRef.current?.classList.remove("invalid");
            numberRef.current?.classList.add("valid");
        } else {
            numberRef.current?.classList.remove("valid");
            numberRef.current?.classList.add("invalid");
        }

        // Validate length
        if(event.target.value.length >= 8) {
            lengthRef.current?.classList.remove("invalid");
            lengthRef.current?.classList.add("valid");
        } else {
            lengthRef.current?.classList.remove("valid");
            lengthRef.current?.classList.add("invalid");
        }
    }

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // prevent page reload on form submit
        const formData = new FormData(event.currentTarget);
        await handleSubmit(formData);
    }

    return (
        <>
        <div>
            <p>
                Already Have an account? <a href="/accounts/login/">Sign in</a>
            </p>
            <div>
                <div>Create Account</div>
                <form className="text-gray-600">
                    <p>Full Name</p><input type="text" name="name" placeholder="Full Name"  required/>
                    <p>Username</p><input type="text" name="username" placeholder="Username" required/>
                    <p>Profile Picture</p><input type="file" name="pfp" required/>
                    <p>Email</p><input type="email" name="email" placeholder="Email" required/>
                    <p>Password</p><input type="password" name="password" placeholder="Password" onFocus={handlePasswordFocus} onBlur={handlePasswordBlur} onChange={handlePasswordValidation} pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters" required/>
                    <p>Confirm Password</p><input type="password" name="confirmPassword" placeholder="Confirm Password" required/>
                    <button formAction={handleSubmit}>Create Account</button>
                </form>
                <div id="message" ref={msgRef} className="hidden">
                <h3>Password must contain the following:</h3>
                    <div id="letter" className="invalid" ref={letterRef}>A <b>lowercase</b> letter</div>
                    <div id="capital" className="invalid" ref={capitalRef}>A <b>capital (uppercase)</b> letter</div>
                    <div id="number" className="invalid" ref={numberRef}>A <b>number</b></div>
                    <div id="length" className="invalid" ref={lengthRef}>Minimum <b>8 characters</b></div>
                </div>
            </div>
        </div>
        </>
    )
}

export default CreateClientside;