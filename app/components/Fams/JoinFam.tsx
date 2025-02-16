"use client"

import { useState } from "react";
import { handleFamJoin } from "@/app/actions";


export default async function JoinFam({fam_id, is_member}: {fam_id: number, is_member: boolean}){
    "use client"

    const [loading, setLoading] = useState(false);
    const [isMember, setIsMember] = useState(is_member);

    const clientFamJoin = async () => {
        try{
            if(isMember) return;
            setLoading(true);
            await handleFamJoin(fam_id);
            setIsMember(true);
        }
        catch (error){
            console.log("error adding membership to DB:", error);   
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <button
            disabled={loading || isMember}
            onClick={clientFamJoin}
            className={`py-2 px-4 m-4 rounded font-bold text-sm text-base transition ${
            isMember
                ? "bg-gray-200 text-gray-700 border border-gray-300 hover:bg-gray-300"
                : "bg-blue-500 text-white hover:bg-blue-600"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
            {loading ? "Processing..." : !isMember ? "Join Fam" : ""}
        </button>
    )
}
