"use client"

import { useState } from "react";
import { deletePost, deletedRedirect } from "@/app/actions";


export default function DeletePost({postid, username}: {postid: number, username:string}){
    "use client"
    
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const clientDeletePost = async () => {
        if(loading) return;
        setLoading(true);
        await deletePost(postid);   
        setLoading(false);
        setShowModal(false);
        deletedRedirect(username);
    }

    return(
    <div className="flex justify-center items-center w-[100%]">
        <button disabled={loading} onClick={() => setShowModal(true)} className="w-full py-2 bg-red-500 text-white rounded shadow-lg hover:bg-red-600 transition">
            Delete Post
        </button>
        {(showModal) && 
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-4 rounded shadow-lg">
                    <p className="flex justify-center font-semibold">
                        Are you sure you want to delete this post?
                    </p>
                    <p className="mb-4 text-red-500 flex justify-center font-bold">
                        This action cannot be undone.
                    </p>
                    <div className="flex justify-between space-x-2">
                        <button
                            onClick={() => setShowModal(false)}
                            className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={loading}
                            onClick={clientDeletePost}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded "
                        >
                            {loading ? "Deleting..." : "Confirm"}
                        </button>
                    </div>
                </div>
            </div>
        }
    </div>
    )
}