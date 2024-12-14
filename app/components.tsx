"use client"

import React, { FormEvent, useEffect, useState } from "react";
import {handleLike, handleUnlike, handleComment, handleCommentDelete } from "./actions";
import Image from "next/image";
import Link from "next/link";

export function Likes({in_LikeCount, in_isLiked, postid}: { in_LikeCount: number; in_isLiked: boolean; postid: number}){
    "use client"

    const [likeCount, setLikeCount] = useState(in_LikeCount);
    const [isLiked, setIsLiked] = useState(in_isLiked);
    const [loading, setLoading] = useState(false);

    const flipLike = () => {
        if(!loading){
            setLoading(true);
            setIsLiked(!isLiked);
            handleLikeUnlike();
            setLoading(false);
        }
    }

    async function handleLikeUnlike(){
        if(isLiked){
            // reduce likes by 1
            setLikeCount(likeCount - 1);

            // call server action to remove like from DB
            await handleUnlike(postid);
        }
        else{
            // increase likes by 1
            setLikeCount(likeCount + 1);

            // call server action to add like to DB
            await handleLike(postid);
        }
    }

    // trigger reload when isLiked is updated (i think?)
    useEffect(() => {}, [isLiked]);

    return(
    <>
        <div className="flex items-center justify-start">

            <div onClick={flipLike} className="p-2">
                {
                    isLiked
                    ? <Image src="/util/heart-329.png" alt="liked" height={24} width={24}/>
                    : <Image src="/util/empty-heart-492.png" alt="not liked" height={24} width={24}/>
                }
            </div>
            <div>
                {likeCount.toString()} {likeCount === 1 ? <> like</> : <> likes</>} 
            </div>
        </div>
    </>
    )
}

export function Comments({in_commentList, postid, username}: { in_commentList: { username: string, created: string, text: string, commentid: number }[], postid: number, username: string }){
    "use client"
    
    const [commentList, setCommentList] = useState(in_commentList);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);

    async function postComment(formData: FormData){
        setIsLoading(true);
        const commentinfo = await handleComment(formData);
        setCommentList(
            [...commentList, 
                {username: commentinfo.username, created: commentinfo.created, text: commentinfo.text, commentid: commentinfo.commentid}
            ]
        );
        setIsLoading(false);
    }

    async function deleteComment(formData: FormData){
        setIsLoadingDelete(true);
        await handleCommentDelete(Number(formData.get("commentid")) || -1);

        const in_commentid = Number(formData.get("commentid"));
        setCommentList( commentList.filter((comment) => (comment.commentid !== in_commentid)) );
        setIsLoadingDelete(false);
    }

    useEffect(() => {}, [commentList]);

    return(
    <div className="flex flex-col w-[100%] m-8">
        {
            commentList.map((comment) => (
                <div key={comment.commentid} className="flex justify-start items-start px-2">
                    <div className="font-semibold text-blue-900">
                        <Link href={`/users/${comment.username}`}>
                            <span>{comment.username}</span>
                        </Link>
                    </div>
                    <div className="px-2">
                        {comment.text}
                    </div>
                    <div>
                        <form action={deleteComment} hidden={comment.username !== username}>
                            <input type="hidden" value={comment.commentid} name="commentid"></input>
                            <button type="submit" disabled={isLoadingDelete} >❌</button>
                        </form>
                    </div>
                </div>
            ))
        }
        <div className="w-[100%] p-2 pt-8">
            <form     onSubmit={(e) => {
                e.preventDefault(); // Prevent page reload
                const formData = new FormData(e.currentTarget);
                postComment(formData); // call post comment
                e.currentTarget.reset(); // Reset the form inputs
            }} className="w-[100%] flex justify-center">           
                <input type="hidden" name="postid" value={postid}></input>
                <input type="hidden" name="username" value={username}></input>
                <textarea name="text" placeholder="Add a comment..." className="w-[100%] p-2 rounded-lg overflow-hidden resize-none"></textarea>
                <button type="submit" disabled={isLoading} className="text-blue-600 font-bold p-2">Post</button>
            </form>
        </div>
    </div>
    )
}


export function Sidebar({username}: {username:string}){
    return(
    <div className="flex flex-col space-y-5 w-[20%] bg-red-100">
        <div className="bg-red-900 h-[100px] flex items-center justify-center font-extrabold">
            <Link href='/'>LOGO</Link>
        </div>
        <Link href='/'>Home</Link>
        <Link href="/explore">Explore</Link>
        <Link href={`/users/${username}`}>{username}'s Profile</Link>
        <Link href="/accounts/edit">Edit Account</Link>
    </div>
    )
}


export function PFP({filename}: {filename: string}){
    console.log(filename);
    return(
        <Image src={`/pfps/${filename}`} alt="pfp" width={36} height={36} className="rounded-full border-4 border-blue-600 m-2"/>
    )
}

