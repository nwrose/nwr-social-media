"use client"

import { useState } from "react";
import { handleFamJoin, handleFamLeave } from "@/app/actions";


export default function JoinFam({fam_id, is_member}: {fam_id: number, is_member: boolean}){
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

    const clientFamLeave = async () => {
        try {
            if(!isMember) return;
            setLoading(true);
            await handleFamLeave(fam_id);
            setIsMember(false);
        }
        catch(error){
            console.log("error leaving fam and deleting membership from DB:", error);
        }
        finally{
            setLoading(false);
        }
    }

    return (
        <button
            disabled={loading}
            onClick={isMember ? clientFamLeave : clientFamJoin}
            className={`py-2 px-4 m-4 rounded font-bold text-sm text-base transition ${
            isMember
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-blue-500 text-white hover:bg-blue-600"
            } ${loading ? "opacity-50" :""}`}
        >
            {loading ? "Processing..." : isMember ? "Leave Fam" : "Join Fam"}
        </button>
    )
}
