"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { checkFamNameAvailable, handleFamCreateAction } from "@/app/actions";
import { CldUploadFamImage } from "@/app/components/UI/Cld";

export default function CreateFam({ setShowCreate }: { setShowCreate: React.Dispatch<React.SetStateAction<boolean>> }) {
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [verifyName, setVerifyName] = useState<"GOOD" | "LENGTH" | "TAKEN">("GOOD");
    const [verifyDesc, setVerifyDesc] = useState(true);
    const [touched, setTouched] = useState(false); // Track if input has been touched
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    // Debounced Name Validation
    useEffect(() => {
        if (!touched) return; // Prevent validation on initial load

        if (name.length < 2 || name.length > 30) {
            setVerifyName("LENGTH");
            return;
        }

        const timeoutId = setTimeout(async () => {
            try {
                const result = await checkFamNameAvailable(name);
                setVerifyName(result ? "GOOD" : "TAKEN");
            } catch (error) {
                console.log("Error verifying fam name:", error);
            }
        }, 300); // Debounce time

        return () => clearTimeout(timeoutId);
    }, [name, touched]);

    // Description Validation
    useEffect(() => {
        setVerifyDesc(desc.length <= 300);
    }, [desc]);

    // Handlers
    const handleNameChange = useCallback((value: string) => {
        setName(value);
        if (value.length > 30) {
            setVerifyName("LENGTH");
        }
    }, []);

    const handleNameBlur = useCallback(() => {
        setTouched(true);
        if (name.length < 2) {
            setVerifyName("LENGTH");
        }
    }, [name]);

    const handleDescChange = useCallback((value: string) => {
        setDesc(value);
    }, []);

    const handleCreateFam = useCallback(async () => {
        setLoading(true);
        try {
            if (name.length < 2 || name.length > 30) {
                setVerifyName("LENGTH");
                setLoading(false);
                return;
            }

            const result = await checkFamNameAvailable(name);
            if (!result) {
                setVerifyName("TAKEN");
                setLoading(false);
                return;
            }

            setShowModal(true);
        } catch (error) {
            console.log("Error verifying fam name:", error);
            alert("Error verifying fam name");
        } finally {
            setLoading(false);
        }
    }, [name]);

    const handleFamSubmit = useCallback(async () => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("filename", "default_fam");
            formData.append("name", name);
            formData.append("description", desc);
            await handleFamCreateAction(formData);
        } catch (error) {
            console.log("Error while uploading new fam to DB:", error);
            alert("Error creating new fam, please try again");
        } finally {
            setShowModal(false);
            setShowCreate(false);
            setLoading(false);
        }
    }, [name, desc, setShowCreate]);

    function handleCancel() {
        setLoading(true);
        setShowCreate(false);
        setName("");
        setDesc("");
        setVerifyName("GOOD");
        setVerifyDesc(true);
        setTouched(false);
        setLoading(false);
    }

    return (
        <div className="flex flex-col justify-between p-6 my-4 bg-white rounded-lg shadow-lg space-y-6 w-[80%] sm:w-[70%] md:w-[60%] lg:w-[45%] xl-[30%] sm:h-5/6">
            <div className='space-y-6'>
                <div className="flex justify-between">
                    <h2 className="text-xl font-semibold text-gray-700"> Create New Fam </h2>
                    <button className="text-xl font-semibold text-gray-700 hover:bg-red-100 px-1 rounded-sm" onClick={handleCancel}>✖</button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-semibold text-gray-600">  
                            Fam Name
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={name}
                            onChange={(e) => handleNameChange(e.target.value)}
                            onBlur={handleNameBlur}
                            className={`w-full p-2 mt-1 rounded border shadow-sm focus:ring-2 focus:ring-blue-400 ${verifyName === "GOOD" ? "" : "border-red-500"}`}
                        />
                        {(touched && verifyName === "LENGTH") && (
                            <motion.p
                                className="text-red-500 text-sm mt-1"
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                            >
                                Fam name must be between 2 and 30 characters
                            </motion.p>
                        )}
                        {(verifyName === "TAKEN") && (
                            <motion.p
                                className="text-red-500 text-sm mt-1"
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                            >
                                Fam name is taken
                            </motion.p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="bio" className="block text-sm font-semibold text-gray-600">
                            Description
                        </label>
                        <textarea
                            id="bio"
                            value={desc}
                            onChange={(e) => handleDescChange(e.target.value)}
                            className={`w-full p-2 mt-1 rounded border shadow-sm focus:ring-2 focus:ring-blue-400 ${verifyDesc ? "" : "border-red-500"}`}
                            rows={4}
                        />
                        {!verifyDesc && (
                            <motion.p
                                className="text-red-500 text-sm mt-1"
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                            >
                                Fam description must be less than 300 characters
                            </motion.p>
                        )}
                    </div>
                </div>
            </div>
            <div className="w-full flex justify-between">
                <button onClick={handleCancel} className="w-[50%] py-2 bg-gray-400 text-white rounded shadow-lg hover:bg-gray-500 mr-3">
                    Cancel
                </button>
                <button
                    onClick={handleCreateFam}
                    disabled={loading || verifyName !== "GOOD" || !verifyDesc}
                    className="w-[50%] py-2 bg-blue-500 text-white rounded shadow-lg hover:bg-blue-600 transition disabled:opacity-50 ml-3"
                >
                    Create Fam
                </button>
            </div>
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-gray-500 w-[90%] max-w-md">
                        <div className="mb-6 text-center">
                            Upload a Group Avatar?
                        </div>
                        <div className="flex justify-between">
                            <button
                                onClick={handleFamSubmit}
                                className="bg-gray-100 px-4 py-2 rounded-lg shadow hover:bg-gray-200 transition-colors"
                            >
                                Skip
                            </button>
                            <CldUploadFamImage 
                                uploadPreset="posts_and_pfps" 
                                name={name}
                                description={desc}
                                setShowModal={setShowModal}
                                setShowCreate={setShowCreate}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>    
    );
}
