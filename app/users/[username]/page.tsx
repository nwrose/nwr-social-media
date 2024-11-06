import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function UserPage(){
    const supabase = await createClient();

    const {data: {user} } = supabase.auth.getUser();

    return (
    <>
        <div>

        </div>
    </>
    )
}