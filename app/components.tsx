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
        <div className="flex items-center justify-start ">

            <div onClick={flipLike}>
                {
                    isLiked
                    ? <Image src="/util/heart-329.png" alt="liked" height={32} width={32}/>
                    : <Image src="/util/empty-heart-492.png" alt="not liked" height={32} width={32}/>
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
    <div className="flex flex-col">
        {
            commentList.map((comment) => (
                <div key={comment.commentid} className="flex justify-start items-start">
                    <div className="font-semibold text-blue-900">
                        <Link href={`/users/${comment.username}`}>
                            <span>{comment.username}</span>
                        </Link>
                    </div>
                    <div>
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
        <div>
            <form     onSubmit={(e) => {
                e.preventDefault(); // Prevent page reload
                const formData = new FormData(e.currentTarget);
                postComment(formData); // call post comment
                e.currentTarget.reset(); // Reset the form inputs
            }}>
                <input type="text" name="text" placeholder="Write your comment"></input>
                <input type="hidden" name="postid" value={postid}></input>
                <input type="hidden" name="username" value={username}></input>
                <button type="submit" disabled={isLoading}>Comment</button>
            </form>
        </div>
    </div>
    )
}