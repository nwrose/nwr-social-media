"use client"

import { CldImage as CldImageDefault, CldImageProps, CldUploadButton }  from 'next-cloudinary';
import { handlePostAction, handleFamCreateAction } from '@/app/actions';


export function CldImage(props: CldImageProps) {
    "use client"

    return <CldImageDefault {...props} />
}


export function CldUploadButtonClient({ uploadPreset } : { uploadPreset: string}){
    "use client"

    // call server action to save uploaded img filename in database
    const handleSuccess = (result: any) => {
        const form = document.getElementById("post_upload_form") as HTMLFormElement;
        const filenameField = form.querySelector("#filename") as HTMLInputElement;

        if(filenameField){
            filenameField.value = result.info.public_id;
            form.requestSubmit(); // calls the server action
        }
        else{
            alert("failed to locate filename field on image upload");
        }
    };

    return( 
    <>
        <div>
            <CldUploadButton uploadPreset={uploadPreset} onSuccess={handleSuccess}>
                <div className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 font-semibold">
                    Upload New Post
                </div>
            </CldUploadButton>
            <form id="post_upload_form" action={handlePostAction}>
                <input type="hidden" name="filename" id="filename"/>
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