"use client"

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { handleComment, handleCommentDelete, handleCommentLike, handleCommentUnlike } from "@/app/actions";

export default function Comments({
    in_commentList,
    postid,
    my_username,
    }: {
    in_commentList: { username: string; created: string; text: string; commentid: number; like_count:number; liked_by_user:boolean; }[];
    postid: number;
    my_username: string;
    }) {
    "use client"
    
    const [commentList, setCommentList] = useState(in_commentList);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);
    const [showAllComments, setShowAllComments] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);

    const maxVisibleComments = 0;
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
            like_count: 0,
            liked_by_user: false,

        },
        ]);
        setIsLoading(false);
    }

    // Delete comment
    async function deleteComment(commentid: number) {
        if(isLoadingDelete) return;
        setIsLoadingDelete(true);
        await handleCommentDelete(commentid);
        setCommentList((prev) => prev.filter((comment) => comment.commentid !== commentid));
        setIsLoadingDelete(false);
    }

    // toggle comment like
    async function toggleCommentLike(commentid: number, liked_by_user: boolean){
        console.log("\n Comment list like count:", commentList[0].like_count, commentList[0].liked_by_user, "\n");
        try {

            console.log(commentList[0].like_count, commentList[0].liked_by_user);

            // then update locally
            setCommentList((prev) =>
                prev.map((comment) =>
                    (comment.commentid === commentid) 
                    ?   
                    {
                        ...comment,
                        liked_by_user: !liked_by_user,
                        like_count: (liked_by_user ? (comment.like_count - 1) : (comment.like_count + 1)),
                    }
                    : 
                    comment
                )
            );

            console.log(commentList[0].like_count, commentList[0].liked_by_user);

            // if already liked, then unlike, else like  -->  throws error if query errors
            if(!liked_by_user){
                await handleCommentLike(commentid);
            }
            else{
                await handleCommentUnlike(commentid);
            }
        }
        catch (error){
            console.log("error toggling comment like", error);
        }
    } 

    return (
    <div className="flex flex-col w-full bg-white">
        <div
            ref={containerRef}
            className={`overflow-hidden ${hasInteracted ? "transition-[max-height] duration-500 ease-in-out" : ""}`}
            style={{ maxHeight: containerHeight }}
        >
            {commentList.map((comment) => (
                <div key={comment.commentid} className="flex items-start space-x-3 px-3 py-1 my-1 bg-gray-100 bg-opacity-65 rounded-lg shadow-sm">
                    <div className="flex flex-col w-full">
                        <div className="flex justify-between w-full">
                                <div>
                                    <div className="flex">
                                        <Link href={`/users/${comment.username}`} className="font-bold text-blue-800">
                                            {comment.username}
                                        </Link>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {formatDistanceToNow(new Date(comment.created), { addSuffix: true })}
                                    </div>
                                </div>
                            <div className="text-gray-500 text-sm flex items-end space-x-1">
                                <span>
                                    <div className="flex flex-col items-center mt-1">
                                        <button onClick={() => toggleCommentLike(comment.commentid, comment.liked_by_user)}>
                                            <Image
                                                src={comment.liked_by_user ? "/util/heart-329.png" : "/util/empty-heart-492.png"}
                                                alt={comment.liked_by_user ? "Liked" : "Not liked"}
                                                height={16}
                                                width={16}
                                            />
                                            {comment.like_count || 0}
                                        </button>
                                    </div>
                                </span>
                            </div>
                        </div>
                        <p className="flex-1 text-gray-900">{comment.text}</p>
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
            className="text-blue-600 hover:underline self-start mx-3"
            >
                {showAllComments ? "Hide comments" : `View ${commentList.length - maxVisibleComments} comment${commentList.length - maxVisibleComments === 1 ? "" : "s"}`}
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
