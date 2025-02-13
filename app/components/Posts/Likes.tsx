"use client"

import { motion, AnimatePresence } from "framer-motion";


export default function Likes({
    in_LikeCount,
    in_isLiked,
    in_singular,
    postid,
    onLikeToggle, // Accept the function from Post
}: {
    in_LikeCount: number;
    in_isLiked: boolean;
    in_singular: number;
    postid: number;
    onLikeToggle: () => void; // Function prop
}) {
    "use client"
    
    return (
        <div className="flex justify-between w-full pt-1">
            <motion.button onClick={onLikeToggle} className="pl-2" whileTap={{ scale: 1.2 }} whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }}>
                <motion.img
                    src={in_isLiked ? "/util/heart-329.png" : "/util/empty-heart-492.png"}
                    alt={in_isLiked ? "Liked" : "Not liked"}
                    height={24}
                    width={24}
                    animate={{ scale: in_isLiked ? 1.2 : 1 }}
                    transition={{ duration: 0.2 }}
                />
            </motion.button>
            <motion.div className="text-gray-700 flex items-center pr-2 relative h-6">
                
                {/* Like Count Animation */}
                <div className="flex justify-end">
                    <AnimatePresence mode="popLayout">
                        <motion.span
                            key={in_LikeCount}
                            className=""
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 10, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            {in_LikeCount}
                        </motion.span>
                    </AnimatePresence>
                </div>

                <span className="ml-1">like</span>

                {/* Plural "s" Animation */}
                <div className="w-1">
                <AnimatePresence mode="popLayout">
                    {in_singular === 0 && (
                        <motion.span
                            key="plural-s"
                            className="inline-block"
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}  
                            exit={{ y: 10, opacity: 0 }}    
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            s
                        </motion.span>
                    )}
                </AnimatePresence>

                </div>
            </motion.div>
        </div>
    );
}
