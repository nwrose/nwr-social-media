import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import ExploreFams from "./ExploreFams"
import UnderConstruction from "@/app/components/UI/Construction";


export function findFamstemp() {
    return <UnderConstruction />;
}

export default async function findFams() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect("/accounts/login");
    }

    const { data: userData, error: userError } = await supabase.from("users").select("username").eq("uuid", user.id).single();
    if (userError) {
        console.error("Error fetching user:", userError);
        redirect("/error");
    }
    const username = userData?.username ?? "Unknown User";

    const { data: famList, error: famError, status } = await supabase.rpc("get_fams_explore",{ in_uuid: user.id });
    if (famError && status !== 406) {
        console.error("Error fetching fams:", famError);
        redirect("/error");
    }

    return (
        <ExploreFams username={username} uuid={user.id} famList={famList}/>
    );
}
