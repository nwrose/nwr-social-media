"use client"

import { useState } from 'react';
import { handleUpdateCaption } from '@/app/actions';


export default function CaptionChange({current_caption, postid }: {current_caption:string, postid:string }){
    "use client"

    const [showModal, setShowModal] = useState(false);
    const [updatedCaption, setUpdatedCaption] = useState(current_caption);

    return (
    <div>
        <button 
            className="w-full py-2 bg-blue-500 text-white rounded shadow-lg hover:bg-blue-600 transition"
            onClick={() => setShowModal(true)}
        >
            Edit Caption
        </button>

        {/* MODAL */}
        { showModal &&
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
            <div className='w-[90%] max-w-lg opacity-100 bg-gray-100 rounded flex justify-center'>
                <form className='w-full h-full flex flex-col items-center justify-between' action={handleUpdateCaption}>
                    <h1 className='font-semibold text-2xl text-blue-600 w-[full] p-8'>
                        Edit Caption
                    </h1>
                    <label htmlFor='caption' className='hidden'>
                        Caption
                    </label>
                    <textarea 
                        className='w-[80%] p-2 border-black border-radius-2'
                        name='caption'
                        id='caption'
                        rows={4}
                        value={updatedCaption}
                        onChange={(e) => setUpdatedCaption(e.target.value)}
                    />
                    <input id="postid" name='postid' value={postid} type='hidden'/>
                    <div className='text-white font-normal text-lg p-2 flex w-full p-8'>
                        <button className='bg-gray-600 hover:bg-gray-700 p-2 rounded w-[50%] mr-1' onClick={() => {setShowModal(false); setUpdatedCaption(current_caption)}}>
                            Cancel
                        </button>
                        <button type='submit' className='bg-blue-600 p-2 rounded w-[50%] ml-1 hover:bg-blue-700'>
                            Update Caption
                        </button>
                    </div>
                </form>
            </div>
        </div>
        }
    </div>
    )
}

