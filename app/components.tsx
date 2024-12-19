"use client"

import React, { useRef, useEffect, useState } from "react";
import {handleLike, handleUnlike, handleComment, handleCommentDelete, handleFollow, handleUnfollow, deletePost, deletedRedirect} from "./actions";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";


export function Modal({message, onCancel, onConfirm, loading,}
	: { message: string | React.ReactNode; onCancel: () => void; onConfirm: () => void; loading: boolean;}) {
	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
		<div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
			<div className="mb-6 text-center">{message}</div>
			<div className="flex justify-between">
			<button
				onClick={onCancel}
				className="bg-gray-100 px-4 py-2 rounded-lg shadow hover:bg-gray-200 transition-colors"
			>
				Cancel
			</button>
			<button
				disabled={loading}
				onClick={onConfirm}
				className={`px-4 py-2 rounded-lg shadow text-white ${
				loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 transition-colors'
				}`}
			>
				{loading ? 'Processing...' : 'Confirm'}
			</button>
			</div>
		</div>
		</div>
	);
}


export function Likes({
    in_LikeCount,
    in_isLiked,
    postid,
}: {
    in_LikeCount: number;
    in_isLiked: boolean;
    postid: number;
}) {
    const [likeCount, setLikeCount] = useState(in_LikeCount);
    const [isLiked, setIsLiked] = useState(in_isLiked);

    async function handleLikeToggle() {
        setIsLiked(!isLiked);
        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
        isLiked ? await handleUnlike(postid) : await handleLike(postid);
    }

    return (
    <div className="flex justify-between w-full">
        <button onClick={handleLikeToggle} className={`p-2 rounded-full ${isLiked ? "bg-red-200" : "bg-gray-200"} hover:shadow-lg`}>
            <Image
                src={isLiked ? "/util/heart-329.png" : "/util/empty-heart-492.png"}
                alt={isLiked ? "Liked" : "Not liked"}
                height={24}
                width={24}
            />
        </button>
        <div className="text-gray-700 flex justify-start items-start pr-3">
            {likeCount} {likeCount === 1 ? "like" : "likes"}
        </div>
    </div>
    );
}



export function Comments({
    in_commentList,
    postid,
    my_username,
    }: {
    in_commentList: { username: string; created: string; text: string; commentid: number }[];
    postid: number;
    my_username: string;
    }) {
    const [commentList, setCommentList] = useState(in_commentList);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);
    const [showAllComments, setShowAllComments] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);

    const maxVisibleComments = 3;
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerHeight, setContainerHeight] = useState("0px");

    // Calculate container height dynamically
    useEffect(() => {
        if (containerRef.current) {
            const allCommentsHeight = containerRef.current.scrollHeight;
            const visibleCommentsHeight = 4 + Array.from(containerRef.current.children)
                .slice(0, maxVisibleComments)
                .reduce((total, child) => total + 4 + (child as HTMLElement).offsetHeight, 0);

            // Update the height dynamically based on interaction
            if (!hasInteracted) {
                setContainerHeight(`${visibleCommentsHeight}px`);
            } else {
                setContainerHeight(showAllComments ? `${allCommentsHeight}px` : `${visibleCommentsHeight}px`);
            }
        }
    }, [showAllComments, commentList, hasInteracted]);

    // Add new comment
    async function postComment(formData: FormData) {
        setIsLoading(true);
        const commentinfo = await handleComment(formData);
        setCommentList((prev) => [
        ...prev,
        {
            username: commentinfo.username,
            created: commentinfo.created,
            text: commentinfo.text,
            commentid: commentinfo.commentid,
        },
        ]);
        setIsLoading(false);
    }

    // Delete comment
    async function deleteComment(formData: FormData) {
        setIsLoadingDelete(true);
        const commentIdToDelete = Number(formData.get("commentid"));
        await handleCommentDelete(commentIdToDelete);
        setCommentList((prev) => prev.filter((comment) => comment.commentid !== commentIdToDelete));
        setIsLoadingDelete(false);
    }

    return (
    <div className="flex flex-col w-full mt-6">
        <div
            ref={containerRef}
            className={`overflow-hidden ${hasInteracted ? "transition-[max-height] duration-500 ease-in-out" : ""}`}
            style={{ maxHeight: containerHeight }}
        >
            {commentList.map((comment) => (
            <div key={comment.commentid} className="flex items-start space-x-3 px-3 py-1 my-1 bg-gray-50 rounded-lg shadow-sm">
                <div className="flex flex-col w-full">
                    <div className="flex justify-between w-full">
                        <Link href={`/users/${comment.username}`} className="font-bold text-blue-800 hover:underline">
                            {comment.username}
                        </Link>
                        <div className="text-gray-500 text-sm flex items-end space-x-1">
                            <span>
                                {(comment.username === my_username) && (
                                    <form
                                        onSubmit={(e) => {
                                        e.preventDefault();
                                        const formData = new FormData(e.currentTarget);
                                        deleteComment(formData);
                                        }}
                                    >
                                        <input type="hidden" name="commentid" value={comment.commentid} />
                                            <button type="submit" disabled={isLoadingDelete} className="text-red-600 hover:text-red-800">
                                                🗑️
                                            </button>
                                    </form>
                                )}
                            </span>
                            <span>
                                {formatDistanceToNow(new Date(comment.created), { addSuffix: true })}
                            </span>
                        </div>
                    </div>
                    <p className="flex-1 text-gray-700">{comment.text}</p>
                </div>
            </div>
            ))}
        </div>

        {commentList.length > maxVisibleComments && (
            <button
            onClick={() => {
                setHasInteracted(true); 
                setShowAllComments(!showAllComments);
            }}
            className="text-blue-600 hover:underline self-start mt-2"
            >
            {showAllComments ? "Hide comments" : `View ${commentList.length - maxVisibleComments} more comment${commentList.length - maxVisibleComments === 1 ? "" : "s"}`}
            </button>
        )}
        
        <form
            onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            postComment(formData);
            e.currentTarget.reset();
            }}
            className="flex flex-col mt-4 space-y-3"
        >
            <textarea
            name="text"
            placeholder="Add a comment..."
            className="w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <input type="hidden" name="postid" value={postid} />
            <input type="hidden" name="username" value={my_username} />
            <button
            type="submit"
            disabled={isLoading}
            className="self-end px-4 py-2 text-white bg-blue-600 rounded-lg shadow hover:bg-blue-500"
            >
            {isLoading ? "Posting..." : "Post"}
            </button>
        </form>
    </div>
    );
}  


export function Sidebar({ username }: { username: string }) {
    const Links:{text:string, href:string}[] = [
        {text:"Home", href:"/"},
        {text:"Explore", href:"/explore"},
        {text:"Edit Account", href:"/accounts/edit"},
        {text:`${username}'s Page`, href:`/users/${username}`}
    ];

  return (
    <div className="w-[20%]">
        <div className="w-[20%]">
        </div>
        <div className="w-[20%] bg-white shadow-lg h-screen fixed">
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-center h-[100px] text-white text-2xl font-bold">
                    <Link href="/" className="bg-blue-600 rounded-full p-6">
                        LOGO
                    </Link>
                </div>
                <nav className="flex flex-col">
                    {Links.map((link) => (
                        <Link href={link.href} className="hover:bg-blue-200 text-lg text-gray-700 p-4 hover:text-black duration-500 ease-in-out">
                            {link.text}
                        </Link>
                    ))
                    }
                </nav>
            </div>
        </div>
    </div>
  );
}


export function PFP({filename}: {filename: string}){
    return(
        <div style={{ width: 36, height: 36, position: 'relative', overflow: 'hidden' }} className="rounded-full border-2 border-blue-400 my-2 shadow-xl">
            <Image
                src={`/pfps/${filename}`}
                alt='pfp'
                fill
                style={{ objectFit: 'cover' }}
                sizes="36px"
            />
        </div>
    )
}


export function Usercard({username, filename, currently_following, uuid, isSelf}: { username: string; filename: string; currently_following: boolean; uuid: string; isSelf:boolean; }){
    "use client"

    const [loading, setLoading] = useState(false);
    const [isFollowing, setIsFollowing] = useState(currently_following);

    const clientHandleFollow = async () => {
        setLoading(true);
        await handleFollow(uuid);
        setIsFollowing(true);
        setLoading(false);
    }

    const clientHandleUnfollow = async () => {
        setLoading(true);
        await handleUnfollow(uuid);
        setIsFollowing(false);
        setLoading(false);
    }

    return(
    <div key={username} className='w-[80%] shadow-xl p-1 m-5 bg-white rounded-md'>
        <form className='flex justify-between items-center w-[100%]'>
            <Link href={`/users/${username}`} className='flex items-center'>
                <PFP filename={filename}/>
                <div className='text-3xl font-bold px-4'>
                    <p>{username}</p>
                </div>
            </Link>
            <div className='px-4'>
                <input type='hidden' value={username} name='username'></input>
                {(!isSelf) && (
                    (isFollowing) ? (
                        <button disabled={loading} formAction={clientHandleUnfollow} className="border-2 rounded bg-gray-200 font-bold text-gray-700 p-1 disabled:cursor-not-allowed">
                            Following
                        </button>
                    ) : (
                        <button disabled={loading} formAction={clientHandleFollow} className="border-2 rounded bg-blue-400 font-bold text-white p-1 disabled:cursor-not-allowed">
                            Follow
                        </button>
                    )
                )          
                }
                
            </div>
        </form>        
    </div>
    )
}



export function DeletePost({postid, username}: {postid: number, username:string}){
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
        <button disabled={loading} onClick={() => setShowModal(true)} className="bg-red-200 text-red-700 font-bold p-1">
            Delete Post
        </button>
        {(showModal) && 
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-4 rounded shadow-lg">
                    <p className="mb-4 text-red-700">
                        Are you sure you want to delete this post? This action cannot be undone.
                    </p>
                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={() => setShowModal(false)}
                            className="bg-gray-200 px-3 py-1 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={loading}
                            onClick={clientDeletePost}
                            className="bg-red-500 text-white px-3 py-1 rounded"
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

export function Post({
    my_username,
    postid,
    likeCount,
    isLiked,
    post_data,
}: {
    my_username: string;
    postid: string;
    likeCount: number;
    isLiked: boolean;
    post_data: {
    post_filename: string;
    created: string;
    username: string;
    pfp_filename: string;
    comments: Array<{ commentid: number; text: string; created: string; username: string }>;
    likes: Array<{ uuid: string; username: string }>;
    };
}) {
    return (
    <div className="flex flex-col items-center w-full shadow-lg rounded-lg bg-white px-6 pb-6">
        <div className="w-full flex justify-between items-center border-b border-gray-300 ">
            <Link href={`/users/${post_data.username}`} className="flex items-center space-x-3 font-bold text-blue-800 hover:underline">
                <div>
                    <PFP filename={post_data.pfp_filename} />
                </div>
                <span>
                    {post_data.username}
                </span>
            </Link>
            <a href={`/posts/${postid}`} className="text-gray-500 text-sm">
                {formatDistanceToNow(new Date(post_data.created), { addSuffix: true })}
            </a>
        </div>
        <div className="py-4">
            <Image
                src={`/posts/${post_data.post_filename}`}
                alt="Post image"
                width={800}
                height={800}
                className="rounded-lg w-full max-w-full"
            />
        </div>
        <Likes in_LikeCount={likeCount} in_isLiked={isLiked} postid={Number(postid)} />
        <Comments in_commentList={post_data.comments || []} postid={Number(postid)} my_username={my_username} />
    </div>
    );
}

// Render a post with proper sizing and formatting for a posts page
function PagePostImage(){

}

// Render a post with proper sizing and formatting for a feed
function FeedPostImage(){

}