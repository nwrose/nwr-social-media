"use client"

import { useState } from 'react';
import { CldImage as CldImageDefault, CldImageProps, CldUploadButton }  from 'next-cloudinary';
import { handlePostAction, handleFamCreateAction } from '@/app/actions';



export function CldImage(props: CldImageProps) {
    "use client"

    return <CldImageDefault {...props} />
}


export function CldUploadButtonClient({ uploadPreset, fams} : { uploadPreset: string, fams: {fam_id: number, name: string}[]}){
    "use client"

    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState(false);

    // call server action to save uploaded img filename in database
    const handleSuccess = (result: any) => {
        setLoading(true);
        const form = document.getElementById("post_upload_form") as HTMLFormElement;
        const filenameField = form.querySelector("#filename") as HTMLInputElement;

        if(filenameField){
            filenameField.value = result.info.public_id;
            // form.requestSubmit(); // calls the server action  --> I have to do modal first\
            setShowModal(true);
        }
        else{
            alert("failed to locate filename field on image upload");
        }
        setLoading(false);
    };

    const handleSubmit = () => {
        setLoading(true);

        const form = document.getElementById("post_upload_form") as HTMLFormElement;
        const fileNameField = form.querySelector("#filename") as HTMLInputElement;

        // as long as fileName is not null(photo has been seleted) --> submit form (call serverside)
        if(fileNameField){
            form.requestSubmit(); // --> redirects
        }
    }

    return( 
    <>
        <div>
            <CldUploadButton uploadPreset={uploadPreset} onSuccess={handleSuccess}>
                <div className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 font-semibold">
                    Upload New Post
                </div>
            </CldUploadButton>

            <form id="post_upload_form" action={handlePostAction}>  { /* Pass form with filename:string, caption:string, fam: number */ }
                <input type="hidden" name="filename" id="filename"/>
                {/* MODAL */}
                { showModal &&
                    <div className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50`}>
                        <div className="bg-white px-6 pb-6 rounded-lg shadow-gray-500 w-[90%] max-w-md opacity-100">
                            <h1 className='font-bold text-2xl text-blue-600 p-6'>
                                New Post
                            </h1>
                            <div className='bg-gray-100 w-full h-full p-4 text-lg'>
                                <label className='flex flex-col items-start text-green-600 mb-6 font-semibold'>
                                    Photo Chosen: ✅
                                </label>
                                <label className='flex flex-col items-start mb-8 font-semibold' htmlFor='caption'>
                                    Add Caption:
                                    <textarea 
                                        id="caption"
                                        name="caption"
                                        className={`w-full p-2 mt-1 rounded border shadow-sm focus:ring-2 focus:ring-blue-400 font-normal text-base`}
                                        rows={4}
                                    />
                                </label>
                                <legend className='flex flex-col items-start bg-gray-100 font-semibold text-base mb-8'>
                                    <h3 className='mb-2 text-lg'>
                                        Post To:
                                    </h3>
                                    <h4>
                                        🌎 Public:
                                    </h4>
                                    <label className='font-normal mb-2 hover:bg-gray-200 p-1 w-full flex flex justify-start' htmlFor='public'>
                                        <input 
                                            type="radio" 
                                            name="fam_id" 
                                            id="public" 
                                            value={-1}
                                            onChange={() => setSelected(true)}
                                            required
                                        />
                                        &nbsp;Make Post Public
                                    </label>
                                    <h4>
                                        👥 Choose a Fam:
                                    </h4>
                                    {fams.map((fam) => 
                                        <label className='font-normal hover:bg-gray-200 p-1 w-full flex flex justify-start' htmlFor={fam.name}>
                                            <input
                                                type="radio"
                                                name="fam_id"
                                                id={fam.name}
                                                value={fam.fam_id}
                                                onChange={() => setSelected(true)}
                                                required
                                            />
                                            &nbsp;{fam.name}
                                        </label>
                                    )}
                                </legend>
                                <button 
                                    onClick={handleSubmit}
                                    disabled={loading || !selected}
                                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 font-semibold disabled:bg-blue-300 cursor-pointer disabled:cursor-default"
                                >
                                    Upload Post
                                </button>
                            </div>
                        </div>
                    </div>
                }
            </form>
        </div>
    </>
    )
}


export function CldUploadFamImage(
    { uploadPreset, name, description, setShowModal, setShowCreate } 
    : { uploadPreset: string, name: string, description: string, 
        setShowModal: React.Dispatch<React.SetStateAction<boolean>>, 
        setShowCreate: React.Dispatch<React.SetStateAction<boolean>> } 
    ){
    "use client"

    // call server action to save uploaded img filename in database
    const handleSuccess = (result: any) => {
        const form = document.getElementById("fam_upload_form") as HTMLFormElement;
        const filenameField = form.querySelector("#filename") as HTMLInputElement;
    
        if (filenameField) {
            filenameField.value = result.info.public_id;
            
            // Event listener to close modal after form submission
            const closeModal = () => {
                setShowModal(false); // Close the modal
                setShowCreate(false);
                form.removeEventListener("submit", closeModal);
            };
            form.addEventListener("submit", closeModal);
            form.requestSubmit(); // calls the server action
            
        } else {
            alert("Failed to locate filename field on image upload");
        }
    };

    return( 
    <>
        <div>
            <CldUploadButton uploadPreset={uploadPreset} onSuccess={handleSuccess}>
                <div className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 font-semibold">
                    Upload Fam Image
                </div>
            </CldUploadButton>
            <form id="fam_upload_form" action={handleFamCreateAction}>
                <input type="hidden" name="filename" id="filename"/>
                <input type="hidden" name="name" id="name" value={name}/>
                <input type="hidden" name="description" id="description" value={description}/>
            </form>
        </div>
    </>
    )
}