"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";


export default function Sidebar({ username }: { username: string }) {
    "use client"
    
    const [showMenu, setShowMenu] = useState(false);

    const Links:{text:string, href:string}[] = [
        {text:"Home", href:"/"},
        {text:"Explore Users", href:"/explore"},
        {text:"Find a Fam", href:"/fams/explore"},
        {text:"Edit Account", href:"/accounts/edit"},
        {text:`${username}'s Page`, href:`/users/${username}`}
    ];

    const menuVariants = {
        hidden: { height: 0, opacity: 0 },
        visible: { height: "auto", opacity: 1, transition: { duration: 0.3, ease: "easeInOut" } }
    };

  return (
    <div className="w-[100%] sm:w-[20%] sm:min-w-[200px] z-10 sm:block">
        <div className="w-[100%] sm:w-[20%] bg-white shadow-lg sm:h-screen sm:fixed min-w-[200px]">
            {/* Screens larger than a smartphone */}
            <div className="hidden flex flex-col h-full sm:block">
                <div className="flex items-center justify-center h-[100px] text-white text-2xl font-bold">
                    <Link href="/" className="bg-blue-600 rounded-2xl py-3">
                        <Image
                            src="/util/intrafam-logo.png"
                            alt="LOGO"
                            height={64}
                            width={110}
                        />
                    </Link>
                </div>
                <nav className="flex flex-col">
                    {Links.map((link, i) => (
                        <Link key={i} href={link.href} className="hover:bg-blue-200 text-lg text-gray-700 p-4 hover:text-black transition duration-500 ease-in-out">
                            {link.text}
                        </Link>
                    ))
                    }
                </nav>
            </div>

            {/* Smartphone sized screens */}
            <div className="block sm:hidden">
                <div>
                    <div className="flex items-center justify-between h-[100px]">
                        <Link href="/" className="bg-blue-600 rounded-2xl py-3 text-white text-2xl font-bold mx-4">
                            <Image
                                src="/util/intrafam-logo.png"
                                alt="LOGO"
                                height={100}
                                width={96}
                            />
                        </Link>
                        <div className="hover:bg-gray-200 rounded mx-4 w-[60px] flex justify-center">
                            <button className="text-4xl font-bold p-4 text-blue-600" onClick={() => setShowMenu(!showMenu)}>
                                { showMenu ? "✖" : "☰"}
                            </button>
                        </div>
                    </div>
                    <motion.div initial="hidden" animate={showMenu ? "visible" : "hidden"} variants={menuVariants} className="overflow-hidden">
                        <div className="rounded border-2 border-blue-600 mb-4 mt-1 w-[95%] mx-auto"/>
                        <nav className="flex flex-col items-start w-full">
                            {Links.map((link) => (
                                <Link key={link.text} href={link.href} className="hover:bg-blue-200 text-lg text-gray-700 p-4 hover:text-black duration-500 ease-in-out w-full">
                                    {link.text}
                                </Link>
                            ))
                            }
                        </nav>
                    </motion.div>
                </div>
            </div>
        </div>
    </div>
  );
}