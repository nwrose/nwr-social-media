"use client"

import { useState } from "react";
import Famcard from "@/app/components/Fams/Famcard";
import CreateFam from "@/app/components/Fams/CreateFam";
import Sidebar from "@/app/components/UI/Sidebar";


interface FamDatum {
    is_member: boolean;
    fam_data: {
        fam_id: number;
        name: string;
        owner_username: string;
        description: string;
        created: string;
        filename: string;
    }
}

export default function ExploreFams({ username, uuid, famList }: { username: string, uuid: string, famList: FamDatum[] }){
    "use client"

    const [showCreate, setShowCreate] = useState(false);


    return (
        <div className="min-h-screen flex flex-col sm:flex-row w-full">
        <Sidebar username={username} />
        <div className="flex flex-col w-full md:w-[80%] bg-gray-50 rounded-lg">
            <div className="p-2 sm:py-4 bg-blue-600 text-white text-lg sm:text-2xl font-bold sticky top-0 z-10">
                <div className="h-full w-full flex justify-between">
                    <span className="h-full p-2 flex justify-center items-center">Find Fams</span>
                    <span className="h-full flex justify-center items-center">
                        <button onClick={() => setShowCreate(true)} className="hover:bg-blue-500 p-2 hover:text-blue-100 rounded">
                            + Create New
                        </button>
                    </span>
                </div>
            </div>
            <div className="w-full flex justify-around flex-wrap justify-center p-4">
                {
                    famList?.map((fam: FamDatum) => (
                        <Famcard
                            key={fam.fam_data.fam_id}
                            current_uuid={uuid}
                            is_member={fam.is_member}
                            fam_data={fam.fam_data}
                        />
                    ))
                }
            </div>
        </div>
        {showCreate && 
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <CreateFam setShowCreate={setShowCreate}/>
            </div>
        }          
    </div>
    )
}