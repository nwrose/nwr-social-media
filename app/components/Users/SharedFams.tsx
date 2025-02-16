"use client"

import { useState } from "react";

export default function SharedFams({ shared_fams, isSelf }: { shared_fams: Array<{ fam_id: number; name: string; }>, isSelf: boolean }) {
    "use client"
    
    const [showFams, setShowFams] = useState(false);

    function toggleShowFams() {
        setShowFams((showFams) => !showFams);
    }

    return (
        <div className="flex flex-col">
            <div onClick={toggleShowFams} className="cursor-pointer text-blue-500 hover:bg-gray-100 p-2 rounded font-semibold">
                {showFams
                    ?  `Hide ${isSelf ? "My" : "Our"} Fams`
                    :  `View ${isSelf ? "My" : "Our"} Fams`
                }
            </div>
            <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${showFams ? "max-h-96" : "max-h-0"}` /* reduce "out" duration */ }
            >
                <div className="mt-2">
                    {shared_fams?.map((shared_fam) =>
                        <a key={shared_fam.fam_id} href={`/fams/${shared_fam.fam_id}`} className="block m-1 p-1 bg-gray-50 rounded-full">
                            👥 {shared_fam.name}
                        </a>
                    )}
                </div>
            </div>
        </div>
    )
}
