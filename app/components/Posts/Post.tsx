"use client"

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { handleLike, handleUnlike} from "@/app/actions";
import { CldImage } from "@/app/components/UI/Cld";
import PFP from "@/app/components/Users/pfp";
import Comments from "@/app/components/Posts/Comments";
import Likes from "@/app/components/Posts/Likes";


export default function Post({my_username, postid, likeCount, isLiked, isFeed, post_data}: {
    my_username: string;
    postid: string;
    likeCount: number;
    isLiked: boolean;
    isFeed: boolean;
    post_data: {
        post_filename: string;
        created: string;
        username: string;
        pfp_filename: string;
        caption: string;
        fam_id: number;
        fam_name: string;
        comments: Array<{ commentid: number; text: string; created: string; username: string; like_count:number; liked_by_user:boolean;}>;
        likes: Array<{ uuid: string; username: string }>;
    };
}) {
    "use client"
    
    const [localLikeCount, setLocalLikeCount] = useState(likeCount);
    const [localIsLiked, setLocalIsLiked] = useState(isLiked);
    const [showHeart, setShowHeart] = useState(false);
    const [countIsSingular, setCountIsSingular] = useState(likeCount == 1 ? 1 : 0); // 1 => count is singular, 0 => count is not singular

    async function handleLikeToggle() {
        setLocalIsLiked((prev) => !prev);
        
        setLocalLikeCount((prevLikeCount) => {
            const newLikeCount = localIsLiked ? prevLikeCount - 1 : prevLikeCount + 1;
    
            // Ensure countIsSingular updates correctly
            if (prevLikeCount === 1) {
                setCountIsSingular(0);
            }
            if (newLikeCount === 1) {
                setCountIsSingular(1);
            }
    
            return newLikeCount;
        });
    
        if (localIsLiked) {
            await handleUnlike(Number(postid));
        } else {
            await handleLike(Number(postid));
        }
    }

    async function handleDoubleClick(){
        if(!localIsLiked){
            handleLikeToggle();
        }
        setShowHeart(true);
        setTimeout(() => setShowHeart(false), 500);
    }

    return (
        <div className="flex flex-col items-center w-full shadow-lg rounded-lg bg-white px-4 pb-4 sm:px-6 sm:pb-6 ">
            <div className="w-full flex justify-between items-center border-b border-gray-300 ">
                <div className="flex flex-col">
                    <Link href={`/users/${post_data.username}`} className="flex items-center space-x-3 font-bold text-blue-800">
                        <div>
                            <PFP filename={post_data.pfp_filename} />
                        </div>
                        <span>{post_data.username}</span>
                    </Link>
                </div>
                {isFeed ? (
                    <a href={`/posts/${postid}`} className="text-gray-500 h-[100%] flex items-center hover:text-gray-700">
                        <span className="hidden sm:block mr-2 text-xs sm:text-sm">
                            {formatDistanceToNow(new Date(post_data.created), { addSuffix: true })}
                        </span>
                        <span className="text-3xl sm:text-2xl font-bold flex items-center leading-none">⌕</span>
                    </a>
                ) : (
                    <span className="text-gray-500 flex items-center h-[100%]">
                        <span className="mr-2 text-xs md:text-sm">
                            {formatDistanceToNow(new Date(post_data.created), { addSuffix: true })}
                        </span>
                    </span>
                )}
            </div>
            <div className="w-full bg-white pt-4 mx-auto">
                <div className="relative w-full feedImage" onDoubleClick={handleDoubleClick}>
                    <CldImage
                        src={post_data.post_filename}
                        alt="Post image"
                        fill
                        className="object-cover rounded-lg"
                    />
                    <AnimatePresence>
                        {showHeart && (
                            <motion.img
                                src="/util/heart-329.png"
                                alt="Liked"
                                className="absolute inset-0 m-auto w-20 h-20"
                                initial={{ scale: 0, opacity: 0 , y: 0 }}
                                animate={{ scale: 1.5, opacity: 1, y: 0 }}
                                exit={{ scale: 0, opacity: 0, y: 100 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </div>
            <Likes 
                in_LikeCount={localLikeCount} 
                in_isLiked={localIsLiked} 
                in_singular={countIsSingular}
                postid={Number(postid)} 
                onLikeToggle={handleLikeToggle}
            />
            <div className="w-full flex items-center justify-start">    
                {post_data.fam_id ? (
                    <a href={`/fams/${post_data.fam_id.toString()}`} className="text-sm text-gray-500 ml-2 mt-2">
                        👥 {post_data.fam_name}
                    </a>
                ) : (
                    <span className="text-sm text-gray-500 ml-2 mt-2">
                        🌎 Public
                    </span>
                )}
            </div>
            { (post_data.caption && post_data.caption != "") &&
                <div className="flex items-start px-3 py-1 my-1 w-full">
                    <div className="flex flex-col w-full">
                        <div className="flex justify-between w-full">
                            <div>
                                <div className="flex">
                                    <Link href={`/users/${post_data.username}`} className="font-bold text-blue-800">
                                        {post_data.username}
                                    </Link>
                                </div>
                            </div>
                            <div className="text-gray-500 text-sm flex items-end space-x-1">
                            </div>
                        </div>
                        <p className="flex-1 text-gray-900">
                            {post_data.caption}
                        </p>
                    </div>
                </div>
            }
            <Comments in_commentList={post_data.comments || []} postid={Number(postid)} my_username={my_username} />
        </div>
    );
}