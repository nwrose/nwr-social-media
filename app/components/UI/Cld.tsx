"use client"

import { CldImage as CldImageDefault, CldImageProps, CldUploadButton }  from 'next-cloudinary';
import { handlePostAction } from '@/app/actions';


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
                <div className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
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