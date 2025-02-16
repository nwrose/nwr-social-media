"use client"

import React, { ReactNode } from "react";

// display the inputted component as a part of the rightbar
const Rightbar: React.FC<{children: ReactNode}> = ({ children }) => {
    "use client"

    return (
        <div className="w-[100%] sm:w-[20%] sm:min-w-[200px] z-10 sm:block">
            <div className="w-[100%] sm:w-[20%] bg-white shadow-lg sm:h-screen sm:fixed min-w-[200px]">
                {/* Screens larger than a smartphone --> hidden for smartphones */}
                <div className="hidden sm:block h-full w-[100%] flex flex-col items-center justify-center">
                    { children }
                </div>
            </div>
        </div>
    );
}

export default Rightbar;